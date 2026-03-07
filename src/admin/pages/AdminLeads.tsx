
/// <reference types="google.maps" />
import React, { useState, useEffect } from 'react';
import {
    UploadCloud,
    Mail,
    Phone,
    MessageCircle,
    Search,
    RefreshCw,
    X,
    Send,
    MapPin,
    Plus,
    LayoutList,
    Trash2,
    Loader2
} from 'lucide-react';
import { collection, addDoc, getDocs, orderBy, query, serverTimestamp, getDoc, setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import * as xlsx from 'xlsx';
import emailjs from '@emailjs/browser';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import AdminAuth from '../components/AdminAuth';
import { useCurrentWorkerRole } from '../store/adminStore';

// Initialize EmailJS (replace with actual public key if needed, or use env vars)
// emailjs.init("YOUR_PUBLIC_KEY");

interface Lead {
    id?: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    website?: string | null;
    status: 'new' | 'contacted' | 'replied' | 'converted';
    createdAt?: ReturnType<typeof serverTimestamp>;
}

interface MapResult {
    place_id: string;
    name: string;
    address: string;
    rating?: number | null;
    website?: string | null;
    phoneNumber?: string | null;
    email?: string;
}

export default function AdminLeads() {
    const { role, isAdmin, isManager, loading: roleLoading } = useCurrentWorkerRole();
    const canSeePage = !role || isAdmin || isManager;

    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [importLoading, setImportLoading] = useState(false);

    // Email Modal State
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [emailSubject, setEmailSubject] = useState('Introduction from Talos Design');
    const [emailBody, setEmailBody] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);

    // Bulk Management & Details State
    const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
    const [isBulkEmailModalOpen, setIsBulkEmailModalOpen] = useState(false);
    const [isBulkWhatsAppModalOpen, setIsBulkWhatsAppModalOpen] = useState(false);
    const [whatsAppMessage, setWhatsAppMessage] = useState('Hi there! I wanted to reach out from Talos Design.');
    const [isLeadDetailsModalOpen, setIsLeadDetailsModalOpen] = useState(false);
    const [viewingLead, setViewingLead] = useState<Lead | null>(null);

    // Maps Search State
    const [activeTab, setActiveTab] = useState<'table' | 'maps'>('table');
    const [mapQuery, setMapQuery] = useState('');
    const [mapLocation, setMapLocation] = useState('');
    const [mapResults, setMapResults] = useState<MapResult[]>([]);
    const [mapSearchNextPageToken, setMapSearchNextPageToken] = useState<string | null>(null);
    const [isSearchingMaps, setIsSearchingMaps] = useState(false);

    // Track manually inputted emails for map results before saving
    const [mapResultEmails, setMapResultEmails] = useState<{ [place_id: string]: string }>({});

    useEffect(() => {
        if (canSeePage) {
            fetchLeads();
        }
    }, [canSeePage]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            const fetchedLeads: Lead[] = [];
            snap.forEach((doc) => {
                fetchedLeads.push({ id: doc.id, ...doc.data() } as Lead);
            });
            setLeads(fetchedLeads);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImportLoading(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = xlsx.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const json: Array<Array<string | number | undefined>> = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

                // Assuming row 0 is headers: Name, Email, Phone, Company
                // Adjust index based on actual excel format
                const headers = json[0].map((h) => h?.toString().toLowerCase().trim() || '');

                const nameIdx = headers.findIndex((h) => h.includes('name'));
                const emailIdx = headers.findIndex((h) => h.includes('email'));
                const phoneIdx = headers.findIndex((h) => h.includes('phone') || h.includes('number'));
                const companyIdx = headers.findIndex((h) => h.includes('company') || h.includes('org'));
                const websiteIdx = headers.findIndex((h) => h.includes('website') || h.includes('url'));


                if (nameIdx === -1 && emailIdx === -1) {
                    alert('Could not find Name or Email columns in the Excel file.');
                    setImportLoading(false);
                    return;
                }

                const newLeads = [];
                for (let i = 1; i < json.length; i++) {
                    const row = json[i];
                    if (!row || row.length === 0) continue;

                    const name = nameIdx !== -1 ? row[nameIdx] : 'Unknown';
                    const email = emailIdx !== -1 ? row[emailIdx] : null;
                    const phone = phoneIdx !== -1 ? row[phoneIdx] : '';
                    const company = companyIdx !== -1 ? row[companyIdx] : '';
                    const website = websiteIdx !== -1 ? row[websiteIdx] : '';


                    if (email) {
                        newLeads.push({
                            name: name || 'Unknown',
                            email,
                            phone: phone ? String(phone) : '',
                            company: company || '',
                            website: website ? String(website) : '',
                            status: 'new',
                            createdAt: serverTimestamp()
                        });
                    }
                }

                // Upload to Firestore
                for (const lead of newLeads) {
                    await addDoc(collection(db, 'leads'), lead);
                }

                alert(`Successfully imported ${newLeads.length} leads.`);
                fetchLeads(); // Refresh list
                setSelectedLeadIds([]); // Clear selection on import

            } catch (error) {
                console.error('Error parsing Excel file:', error);
                alert('Failed to parse Excel file.');
            } finally {
                setImportLoading(false);
                if (e.target) e.target.value = ''; // Reset file input
            }
        };

        reader.readAsArrayBuffer(file);
    };

    const openEmailModal = (lead: Lead) => {
        setSelectedLead(lead);
        setEmailSubject('Introduction from Talos Design');
        setEmailBody(
            `Hi ${lead.name.split(' ')[0] || lead.name},

I noticed ${lead.company ? lead.company : 'your work'} and wanted to reach out.At Talos Design, we specialize in building high - performance web applications and digital presences.

    I'd love to connect and share some ideas on how we could help scale your online operation.

Best,
    Talos Design Team`
        );
        setIsEmailModalOpen(true);
    };

    const sendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLead) return;

        setSendingEmail(true);

        try {
            // NOTE: Replace these with your actual EmailJS Service ID, Template ID, and Public Key.
            // You need a template in EmailJS that accepts {{to_email}}, {{to_name}}, {{subject}}, and {{message}}
            const serviceId = 'YOUR_SERVICE_ID'; // Replace via env vars or actual string
            const templateId = 'YOUR_TEMPLATE_ID';
            const publicKey = 'YOUR_PUBLIC_KEY';

            const templateParams = {
                to_email: selectedLead.email,
                to_name: selectedLead.name,
                subject: emailSubject,
                message: emailBody,
                reply_to: 'contact@talos.design'
            };

            await emailjs.send(serviceId, templateId, templateParams, publicKey);

            alert('Email sent successfully!');
            setIsEmailModalOpen(false);

            // TODO: Update lead status to 'contacted' in Firestore if desired

        } catch (error) {
            console.error('FAILED to send email...', error);
            alert('Failed to send email. Check console for details.');
        } finally {
            setSendingEmail(false);
        }
    };

    const handleMapSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mapQuery || !mapLocation) return;

        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            alert("Google Maps API Key is missing. Please set VITE_GOOGLE_MAPS_API_KEY in your .env file.");
            return;
        }

        setIsSearchingMaps(true);
        setMapResults([]);
        setMapSearchNextPageToken(null); // Reset next page token for new search

        try {
            // 1. Check Rate Limiter in Firestore
            const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
            const limitsRef = doc(db, 'settings', 'apiLimits');
            const limitsSnap = await getDoc(limitsRef);

            let usageCount = 0;
            let lastUsedDate = '';

            if (limitsSnap.exists()) {
                const data = limitsSnap.data();
                if (data.dailyMapsSearches) {
                    lastUsedDate = data.dailyMapsSearches.date;
                    if (lastUsedDate === today) {
                        usageCount = data.dailyMapsSearches.count || 0;
                    }
                }
            }

            const DAILY_LIMIT = 10;
            if (usageCount >= DAILY_LIMIT) {
                alert(`Daily limit of ${DAILY_LIMIT} searches reached to prevent unexpected API costs.Try again tomorrow.`);
                setIsSearchingMaps(false);
                return;
            }

            // 1.5 Check Cache First
            const cacheDocId = `${mapQuery.toLowerCase().trim()}_${mapLocation.toLowerCase().trim()}`.replace(/[^a-z0-9]/g, '_');
            const cacheRef = doc(db, 'mapSearches', cacheDocId);
            const cacheSnap = await getDoc(cacheRef);

            if (cacheSnap.exists()) {
                const cacheData = cacheSnap.data();
                const cacheTimestamp = cacheData.timestamp?.toDate();
                const now = new Date();
                const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

                // If cache is less than 30 days old, use it
                if (cacheTimestamp && now.getTime() - cacheTimestamp.getTime() < thirtyDaysInMs) {
                    console.log("Serving from Cache:", cacheDocId);
                    setMapResults(cacheData.results || []);
                    setMapSearchNextPageToken(cacheData.nextPageToken || null);
                    setIsSearchingMaps(false);
                    return;
                }
            }

            // 2. Perform the Search (Only if not cached or cache is stale)
            setOptions({
                key: apiKey,
            });

            const { Place } = await importLibrary('places') as any;

            const request = {
                textQuery: `${mapQuery} in ${mapLocation}`,
                fields: ['id', 'displayName', 'formattedAddress', 'businessStatus', 'rating', 'websiteURI', 'internationalPhoneNumber'],
                maxResultCount: 15,
            };

            try {
                const response = await Place.searchByText(request);
                const places = response.places;
                const nextPageToken = (response as any).nextPageToken || null; // The Place.searchByText returns nextPageToken on the response object in JS API

                if (places && places.length > 0) {
                    const parsedResults: MapResult[] = places.map((place: any) => ({
                        place_id: place.id || Math.random().toString(),
                        name: place.displayName || 'Unknown',
                        address: place.formattedAddress || 'Unknown Address',
                        isOpen: typeof place.businessStatus === 'string'
                            ? place.businessStatus === 'OPERATIONAL'
                            : place.isOpen(),
                        rating: place.rating || null,
                        website: place.websiteURI || null,
                        phoneNumber: place.internationalPhoneNumber || null,
                        email: null // Default to null, will allow manual input
                    }));

                    // 3. Increment usage counter
                    await setDoc(limitsRef, {
                        dailyMapsSearches: {
                            date: today,
                            count: usageCount + 1
                        }
                    }, { merge: true });

                    // 4. Save results to cache
                    await setDoc(cacheRef, {
                        query: mapQuery.toLowerCase(),
                        location: mapLocation.toLowerCase(),
                        results: parsedResults,
                        nextPageToken: nextPageToken,
                        timestamp: serverTimestamp()
                    });

                    setMapResults(parsedResults);
                    setMapSearchNextPageToken(nextPageToken);
                    setMapResultEmails({}); // reset manual emails on new search
                } else {
                    setMapResults([]);
                    setMapSearchNextPageToken(null);
                    alert("No results found.");
                }
            } catch (searchError: any) {
                console.error('Places API Error:', searchError);
                if (searchError.code === 'ZERO_RESULTS') {
                    alert("No results found.");
                } else {
                    alert(`Failed to fetch places.See console.`);
                }
            } finally {
                setIsSearchingMaps(false);
            }

        } catch (error) {
            console.error('Error during map search:', error);
            alert('An error occurred while searching. Check console for details.');
            setIsSearchingMaps(false);
        }
    };

    const loadMoreMapResults = async () => {
        if (!mapSearchNextPageToken) return;

        setIsSearchingMaps(true);
        try {
            // Check Daily Limit again before spending another point
            const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
            const limitsRef = doc(db, 'settings', 'apiLimits');
            const limitsSnap = await getDoc(limitsRef);

            let usageCount = 0;
            let lastUsedDate = '';

            if (limitsSnap.exists()) {
                const data = limitsSnap.data();
                if (data.dailyMapsSearches) {
                    lastUsedDate = data.dailyMapsSearches.date;
                    if (lastUsedDate === today) {
                        usageCount = data.dailyMapsSearches.count || 0;
                    }
                }
            }

            const DAILY_LIMIT = 10;
            if (usageCount >= DAILY_LIMIT) {
                alert(`Daily limit of ${DAILY_LIMIT} searches reached to prevent unexpected API costs. Please try again tomorrow.`);
                setIsSearchingMaps(false);
                return;
            }

            // Increment Usage
            await setDoc(limitsRef, {
                dailyMapsSearches: {
                    date: today,
                    count: usageCount + 1
                }
            }, { merge: true });

            const { Place } = await importLibrary("places") as any;

            const request: any = {
                textQuery: `${mapQuery} in ${mapLocation}`,
                fields: ['id', 'displayName', 'formattedAddress', 'businessStatus', 'rating', 'websiteURI', 'internationalPhoneNumber'],
                pageToken: mapSearchNextPageToken
            };

            const response = await Place.searchByText(request);
            const places = response.places;
            const newNextPageToken = (response as any).nextPageToken || null;

            if (places && places.length > 0) {
                const parsedResults: MapResult[] = places.map((place: any) => ({
                    place_id: place.id || Math.random().toString(),
                    name: place.displayName || 'Unknown',
                    address: place.formattedAddress || 'Unknown Address',
                    isOpen: typeof place.businessStatus === 'string'
                        ? place.businessStatus === 'OPERATIONAL'
                        : place.isOpen(),
                    rating: place.rating || null,
                    website: place.websiteURI || null,
                    phoneNumber: place.internationalPhoneNumber || null,
                    email: null
                }));

                const combinedResults = [...mapResults, ...parsedResults];

                // Update Cache with combined results
                const cacheDocId = `${mapQuery.toLowerCase().trim()}_${mapLocation.toLowerCase().trim()}`.replace(/[^a-z0-9]/g, '_');
                const cacheRef = doc(db, 'mapSearches', cacheDocId);

                await setDoc(cacheRef, {
                    query: mapQuery.toLowerCase(),
                    location: mapLocation.toLowerCase(),
                    results: combinedResults,
                    nextPageToken: newNextPageToken,
                    timestamp: serverTimestamp() // Refresh the cache timer
                });

                setMapResults(combinedResults);
                setMapSearchNextPageToken(newNextPageToken);
            } else {
                setMapSearchNextPageToken(null); // No more results
            }
        } catch (error) {
            console.error('Error loading more map results:', error);
            alert('An error occurred while loading more results.');
        } finally {
            setIsSearchingMaps(false);
        }
    };

    const addMapLead = async (mapped: MapResult) => {
        try {
            const assignedEmail = mapResultEmails[mapped.place_id] || '';
            const newLead: Lead = {
                name: mapped.name,
                company: mapped.name,
                email: assignedEmail,
                phone: mapped.phoneNumber || '',
                website: mapped.website || '', // Added website
                status: 'new',
                createdAt: serverTimestamp()
            };
            await addDoc(collection(db, 'leads'), newLead);
            alert(`Added ${mapped.name} to Leads!`);
            fetchLeads(); // refresh the background leads table
        } catch (error) {
            console.error("Error adding map lead:", error);
            alert("Failed to add lead.");
        }
    };

    // --- Selection Handlers ---
    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedLeadIds(filteredLeads.map(l => l.id as string));
        } else {
            setSelectedLeadIds([]);
        }
    };

    const toggleSelectLead = (leadId: string) => {
        setSelectedLeadIds(prev =>
            prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
        );
    };

    const openDetailsModal = (lead: Lead) => {
        setViewingLead(lead);
        setIsLeadDetailsModalOpen(true);
    };

    const sendBulkEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedLeadIds.length === 0) return;

        setSendingEmail(true);
        const leadsToSend = leads.filter(l => selectedLeadIds.includes(l.id as string) && l.email);

        if (leadsToSend.length === 0) {
            alert('None of the selected leads have an email address.');
            setSendingEmail(false);
            return;
        }

        try {
            const serviceId = 'YOUR_SERVICE_ID'; // Replace via env vars
            const templateId = 'YOUR_TEMPLATE_ID';
            const publicKey = 'YOUR_PUBLIC_KEY';

            let successCount = 0;
            for (const lead of leadsToSend) {
                const templateParams = {
                    to_email: lead.email,
                    to_name: lead.name,
                    subject: emailSubject,
                    message: emailBody,
                    reply_to: 'contact@talos.design'
                };

                // Note: you may want to add a small delay here in production to avoid rate limits
                await emailjs.send(serviceId, templateId, templateParams, publicKey);
                successCount++;
            }

            alert(`Successfully sent ${successCount} emails!`);
            setIsBulkEmailModalOpen(false);
            setSelectedLeadIds([]); // clear selection
        } catch (error) {
            console.error('FAILED to send bulk emails...', error);
            alert('An error occurred while sending batch emails. Check console.');
        } finally {
            setSendingEmail(false);
        }
    };

    const deleteSelectedLeads = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedLeadIds.length} leads ? This action cannot be undone.`)) return;

        try {
            for (const id of selectedLeadIds) {
                await deleteDoc(doc(db, 'leads', id));
            }
            alert(`Successfully deleted ${selectedLeadIds.length} leads.`);
            setSelectedLeadIds([]);
            fetchLeads(); // Refresh list
        } catch (error) {
            console.error('Error deleting leads:', error);
            alert('Failed to delete some leads.');
        }
    };

    if (roleLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="w-8 h-8 border-2 border-white/10 border-t-[var(--accent-orange)] rounded-full animate-spin" />
            </div>
        );
    }

    if (!canSeePage) {
        return <AdminAuth />;
    }

    const filteredLeads = leads.filter(l =>
        l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8 relative">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">Leads & Outreach</h1>
                    <p className="text-[var(--text-secondary)] font-medium">Manage potential clients and send cold emails.</p>
                </div>

                <div className="flex gap-4">
                    <div className="flex bg-[rgba(255,255,255,0.02)] p-1 rounded-xl border border-[rgba(255,255,255,0.05)]">
                        <button
                            onClick={() => setActiveTab('table')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'table'
                                ? 'bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] shadow-sm'
                                : 'text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                                } `}
                        >
                            <LayoutList size={16} />
                            Saved Leads
                        </button>
                        <button
                            onClick={() => setActiveTab('maps')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === 'maps'
                                ? 'bg-[var(--accent-orange)]/20 text-[var(--accent-orange)] shadow-sm'
                                : 'text-[var(--text-muted)] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
                                } `}
                        >
                            <MapPin size={16} />
                            Discover Maps
                        </button>
                    </div>

                    {activeTab === 'table' && (
                        <>
                            <button
                                onClick={fetchLeads}
                                className="p-2.5 rounded-lg border border-[rgba(255,255,255,0.1)] bg-[var(--bg-card)] hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] hover:text-white transition-all shadow-sm group"
                                title="Refresh Leads"
                                disabled={loading}
                            >
                                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                            </button>

                            <div className="relative">
                                <input
                                    type="file"
                                    accept=".xlsx, .xls, .csv"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    disabled={importLoading}
                                />
                                <button
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[var(--accent-orange)] to-[var(--accent-orange-hover)] text-white hover:opacity-90 font-medium tracking-wide transition-all shadow-lg hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] border border-[rgba(255,255,255,0.1)]"
                                    disabled={importLoading}
                                >
                                    {importLoading ? <RefreshCw size={18} className="animate-spin" /> : <UploadCloud size={18} />}
                                    {importLoading ? 'Importing...' : 'Import Excel'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {activeTab === 'maps' ? (
                <div className="space-y-6">
                    <div className="bg-[var(--bg-card)] rounded-xl border border-[rgba(255,255,255,0.08)] p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-orange)] opacity-5 rounded-full blur-[80px] pointer-events-none" />
                        <h2 className="text-xl font-display font-semibold text-white mb-4">Find Businesses via Google Maps</h2>
                        <form onSubmit={handleMapSearch} className="flex flex-col sm:flex-row gap-4 relative z-10">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Search Query</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Restaurants, Plumbers, Tech Companies"
                                    value={mapQuery}
                                    onChange={(e) => setMapQuery(e.target.value)}
                                    className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] transition-all"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Location</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Dallas, TX or 75001"
                                    value={mapLocation}
                                    onChange={(e) => setMapLocation(e.target.value)}
                                    className="w-full bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-orange)] focus:ring-1 focus:ring-[var(--accent-orange)] transition-all"
                                />
                            </div>
                            <div className="flex items-end">
                                <button
                                    type="submit"
                                    disabled={isSearchingMaps}
                                    className="h-[46px] w-full sm:w-auto px-6 rounded-lg bg-[var(--accent-orange)] text-white font-medium hover:opacity-90 flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
                                >
                                    {isSearchingMaps ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
                                    Search Maps
                                </button>
                            </div>
                        </form>
                    </div>

                    {mapResults.length > 0 && (
                        <div className="bg-[var(--bg-card)] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-xl">
                            <div className="p-4 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] flex justify-between items-center">
                                <h3 className="font-display text-white font-medium">Search Results ({mapResults.length})</h3>
                                <div className="text-xs text-[var(--text-muted)]">Powered by Google Places</div>
                            </div>
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-[rgba(255,255,255,0.05)] text-xs uppercase tracking-wider text-[var(--text-muted)] font-display font-medium">
                                            <th className="p-4 pl-6">Business Name</th>
                                            <th className="p-4">Address</th>
                                            <th className="p-4 text-center">Tags</th>
                                            <th className="p-4 text-center">Rating</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4 text-right pr-6">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mapResults.map((result) => (
                                            <tr key={result.place_id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                                                <td className="p-4 pl-6 font-medium text-white">{result.name}</td>
                                                <td className="p-4 text-sm text-[var(--text-secondary)]">{result.address}</td>
                                                <td className="p-4 text-center">
                                                    <div className="flex flex-wrap gap-1.5 justify-center">
                                                        {result.website && (
                                                            <a href={result.website} target="_blank" rel="noreferrer" className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors" title="Visit Website">
                                                                Website
                                                            </a>
                                                        )}
                                                        {result.phoneNumber && (
                                                            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20" title={result.phoneNumber}>
                                                                Phone / WA
                                                            </span>
                                                        )}
                                                        {!result.website && !result.phoneNumber && (
                                                            <span className="text-[10px] text-[var(--text-muted)]">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    {result.rating ? (
                                                        <span className="inline-flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                                            {result.rating} <span className="text-[10px]">★</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-sm text-[var(--text-muted)]">-</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <input
                                                        type="email"
                                                        placeholder="Add email (optional)"
                                                        value={mapResultEmails[result.place_id] || ''}
                                                        onChange={(e) => setMapResultEmails(prev => ({ ...prev, [result.place_id]: e.target.value }))}
                                                        className="w-full min-w-[140px] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] rounded px-2 py-1 text-xs text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] transition-colors"
                                                    />
                                                </td>
                                                <td className="p-4 pr-6 text-right">
                                                    <button
                                                        onClick={() => addMapLead(result)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[rgba(255,255,255,0.05)] hover:bg-[var(--accent-cyan)]/20 text-[var(--text-secondary)] hover:text-[var(--accent-cyan)] transition-all text-sm font-medium border border-[rgba(255,255,255,0.1)] hover:border-[var(--accent-cyan)]/30"
                                                    >
                                                        <Plus size={14} /> Add Lead
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {mapSearchNextPageToken && (
                                <div className="p-4 border-t border-[rgba(255,255,255,0.05)] flex justify-center">
                                    <button
                                        onClick={loadMoreMapResults}
                                        disabled={isSearchingMaps}
                                        className="px-6 py-2 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] rounded-full text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isSearchingMaps ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                                        Load More Results
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Search */}
                    <div className="mb-6 relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads by name, email, or company..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[var(--bg-card)] border border-[rgba(255,255,255,0.1)] rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] transition-all shadow-inner"
                        />
                    </div>

                    {/* Table */}
                    <div className="bg-[var(--bg-card)] rounded-xl border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-2xl relative">
                        <div className="p-4 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)] flex justify-between items-center">
                            <h3 className="font-display text-white font-medium">Saved Leads ({filteredLeads.length})</h3>
                        </div>

                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.01)] text-xs uppercase tracking-wider text-[var(--text-muted)] font-display font-medium">
                                        <th className="p-4 pl-6 w-12">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] text-[var(--accent-orange)] focus:ring-[var(--accent-orange)] focus:ring-offset-0 focus:ring-1"
                                                checked={selectedLeadIds.length === filteredLeads.length && filteredLeads.length > 0}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Contact</th>
                                        <th className="p-4">Company</th>
                                        <th className="p-4">Website</th> {/* New Website Column */}
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right pr-6">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-[var(--text-muted)]">
                                                <div className="flex justify-center mb-2">
                                                    <div className="w-6 h-6 border-2 border-[rgba(255,255,255,0.1)] border-t-[var(--accent-orange)] rounded-full animate-spin" />
                                                </div>
                                                Loading leads...
                                            </td>
                                        </tr>
                                    ) : filteredLeads.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-[var(--text-muted)]">
                                                No leads found. Import an Excel file or Discover via Maps to get started.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredLeads.map((lead) => (
                                            <tr key={lead.id} className={`border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)] transition-colors group ${selectedLeadIds.includes(lead.id as string) ? 'bg-[var(--accent-orange)]/5' : ''} `}>
                                                <td className="p-4 pl-6 w-12" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.05)] text-[var(--accent-orange)] focus:ring-[var(--accent-orange)] focus:ring-offset-0 focus:ring-1 cursor-pointer"
                                                        checked={selectedLeadIds.includes(lead.id as string)}
                                                        onChange={() => toggleSelectLead(lead.id as string)}
                                                    />
                                                </td>
                                                <td className="p-4 cursor-pointer" onClick={() => openDetailsModal(lead)}>
                                                    <div className="font-medium text-white hover:text-[var(--accent-cyan)] transition-colors">{lead.name}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-wrap gap-1.5 justify-start">
                                                        {lead.email && (
                                                            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20" title={lead.email}>
                                                                Email
                                                            </span>
                                                        )}
                                                        {lead.phone && (
                                                            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20" title={lead.phone}>
                                                                Phone / WA
                                                            </span>
                                                        )}
                                                        {!lead.email && (
                                                            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] border border-[rgba(255,255,255,0.05)]">
                                                                No Email
                                                            </span>
                                                        )}
                                                        {!lead.phone && (
                                                            <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] border border-[rgba(255,255,255,0.05)]">
                                                                No Phone
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-[var(--text-secondary)] text-sm">
                                                    {lead.company || '-'}
                                                </td>
                                                <td className="p-4">
                                                    {lead.website ? (
                                                        <a
                                                            href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-400 hover:text-blue-300 hover:underline max-w-[150px] truncate block text-sm"
                                                            title={lead.website}
                                                        >
                                                            {new URL(lead.website.startsWith('http') ? lead.website : `https://${lead.website}`).hostname.replace('www.', '')}
                                                        </a>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)]">
                                                            No Website
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] border border-[rgba(255,255,255,0.1)]">
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 pr-6 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {lead.phone ? (
                                                            <>
                                                                <a href={`tel:${lead.phone} `} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[rgba(255,255,255,0.05)] hover:bg-slate-700 text-[var(--text-secondary)] hover:text-white transition-all text-xs font-medium border border-[rgba(255,255,255,0.1)]" title="Call">
                                                                    <Phone size={12} /> Call
                                                                </a>
                                                                <a href={`sms:${lead.phone} `} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[rgba(255,255,255,0.05)] hover:bg-green-500/20 text-[var(--text-secondary)] hover:text-green-400 transition-all text-xs font-medium border border-[rgba(255,255,255,0.1)] hover:border-green-500/30" title="SMS">
                                                                    <MessageCircle size={12} /> SMS
                                                                </a>
                                                            </>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-transparent text-[var(--text-muted)] text-xs font-medium opacity-50 cursor-not-allowed">
                                                                <Phone size={12} /> No Phone
                                                            </span>
                                                        )}

                                                        {lead.email ? (
                                                            <button
                                                                onClick={() => openEmailModal(lead)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[rgba(255,255,255,0.05)] hover:bg-[var(--accent-orange)]/20 text-[var(--text-secondary)] hover:text-[var(--accent-orange)] transition-all text-xs font-medium border border-[rgba(255,255,255,0.1)] hover:border-[var(--accent-orange)]/30" title="Email"
                                                            >
                                                                <Mail size={12} /> Email
                                                            </button>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-transparent text-[var(--text-muted)] text-xs font-medium opacity-50 cursor-not-allowed">
                                                                <Mail size={12} /> No Email
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* Sticky Bulk Actions Bar */}
            {activeTab === 'table' && selectedLeadIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--bg-surface-elevated)] border border-[rgba(255,255,255,0.15)] rounded-full px-6 py-3 shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-8 duration-300">
                    <div className="text-sm font-medium text-white flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[var(--accent-orange)] text-white text-xs">
                            {selectedLeadIds.length}
                        </span>
                        Selected
                    </div>
                    <div className="w-px h-6 bg-[rgba(255,255,255,0.1)]" />
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setEmailSubject('Introduction from Talos Design');
                                setEmailBody('Hi there,\n\nWe would love to help you build an amazing digital presence.\n\nBest,\nTalos Design Team');
                                setIsBulkEmailModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] hover:text-white transition-colors text-sm font-medium border border-transparent hover:border-[rgba(255,255,255,0.1)]"
                        >
                            <Mail size={16} /> Bulk Email
                        </button>
                        <button
                            onClick={() => setIsBulkWhatsAppModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] hover:text-green-400 transition-colors text-sm font-medium border border-transparent hover:border-[rgba(255,255,255,0.1)]"
                        >
                            <MessageCircle size={16} /> Bulk WhatsApp
                        </button>
                        <div className="w-px h-6 bg-[rgba(255,255,255,0.1)] mx-1" />
                        <button
                            onClick={deleteSelectedLeads}
                            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-rose-500/10 text-[var(--text-secondary)] hover:text-rose-400 transition-colors text-sm font-medium border border-transparent hover:border-rose-500/30"
                        >
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                    <button
                        onClick={() => setSelectedLeadIds([])}
                        className="p-1.5 rounded-full hover:bg-[rgba(255,255,255,0.1)] text-[var(--text-muted)] transition-colors ml-2"
                        title="Clear Selection"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Email Modal */}
            {isEmailModalOpen && selectedLead && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !sendingEmail && setIsEmailModalOpen(false)} />

                    <div className="relative w-full max-w-2xl bg-[var(--bg-surface-elevated)] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="absolute top-0 right-0 p-4 z-10">
                            <button
                                onClick={() => !sendingEmail && setIsEmailModalOpen(false)}
                                className="text-[var(--text-muted)] hover:text-white transition-colors bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] p-1.5 rounded-md"
                                disabled={sendingEmail}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)]">
                            <h2 className="text-xl font-display font-medium text-white mb-1">Compose Email</h2>
                            <p className="text-sm text-[var(--text-secondary)]">To: <span className="text-white font-medium">{selectedLead.name}</span> ({selectedLead.email})</p>
                        </div>

                        <form onSubmit={sendEmail} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] transition-all"
                                    disabled={sendingEmail}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Message</label>
                                <textarea
                                    required
                                    rows={8}
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] transition-all resize-y min-h-[150px]"
                                    disabled={sendingEmail}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-[rgba(255,255,255,0.05)]">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (selectedLeadIds.length > 0) {
                                            setSelectedLeadIds([]);
                                        }
                                        setIsEmailModalOpen(false);
                                    }}
                                    className="px-5 py-2.5 rounded-lg text-white font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors border border-transparent"
                                    disabled={sendingEmail}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingEmail}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--accent-orange)] text-white font-medium tracking-wide hover:opacity-90 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(249,115,22,0.3)] disabled:opacity-50 disabled:cursor-not-allowed border border-[rgba(255,255,255,0.1)]"
                                >
                                    {sendingEmail ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                                    {sendingEmail ? 'Sending...' : 'Send via EmailJS'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Email Modal */}
            {isBulkEmailModalOpen && selectedLeadIds.length > 0 && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !sendingEmail && setIsBulkEmailModalOpen(false)} />

                    <div className="relative w-full max-w-2xl bg-[var(--bg-surface-elevated)] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="absolute top-0 right-0 p-4 z-10">
                            <button
                                onClick={() => !sendingEmail && setIsBulkEmailModalOpen(false)}
                                className="text-[var(--text-muted)] hover:text-white transition-colors bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] p-1.5 rounded-md"
                                disabled={sendingEmail}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)]">
                            <h2 className="text-xl font-display font-medium text-white mb-1">Bulk Email Recipients</h2>
                            <p className="text-sm text-[var(--text-secondary)]">
                                You are about to email <span className="text-white font-medium">{selectedLeadIds.length}</span> selected leads.
                            </p>
                        </div>

                        <form onSubmit={sendBulkEmail} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] transition-all"
                                    disabled={sendingEmail}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Message Template</label>
                                <textarea
                                    required
                                    rows={8}
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--accent-cyan)] focus:ring-1 focus:ring-[var(--accent-cyan)] transition-all resize-y min-h-[150px]"
                                    disabled={sendingEmail}
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-[rgba(255,255,255,0.05)]">
                                <button
                                    type="button"
                                    onClick={() => setIsBulkEmailModalOpen(false)}
                                    className="px-5 py-2.5 rounded-lg text-white font-medium hover:bg-[rgba(255,255,255,0.05)] transition-colors border border-transparent"
                                    disabled={sendingEmail}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={sendingEmail}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[var(--accent-cyan)] text-slate-900 font-medium tracking-wide hover:opacity-90 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed border border-[rgba(255,255,255,0.1)]"
                                >
                                    {sendingEmail ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />}
                                    {sendingEmail ? 'Sending Array...' : `Send ${selectedLeadIds.length} Emails`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk WhatsApp Modal */}
            {isBulkWhatsAppModalOpen && selectedLeadIds.length > 0 && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBulkWhatsAppModalOpen(false)} />

                    <div className="relative w-full max-w-2xl bg-[var(--bg-surface-elevated)] border border-[rgba(255,255,255,0.1)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="absolute top-0 right-0 p-4 z-10">
                            <button
                                onClick={() => setIsBulkWhatsAppModalOpen(false)}
                                className="text-[var(--text-muted)] hover:text-white transition-colors bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] p-1.5 rounded-md"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 border-b border-[rgba(255,255,255,0.05)] bg-[rgba(255,255,255,0.02)]">
                            <h2 className="text-xl font-display font-medium text-white mb-1">Bulk WhatsApp</h2>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Preparing WhatsApp web tabs for <span className="text-white font-medium">{selectedLeadIds.length}</span> selected leads.
                            </p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">Message Template</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={whatsAppMessage}
                                    onChange={(e) => setWhatsAppMessage(e.target.value)}
                                    className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.1)] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all resize-y min-h-[100px]"
                                />
                            </div>

                            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-lg p-4">
                                <p className="text-sm text-[var(--text-muted)] mb-3">
                                    <strong>Note:</strong> Browsers block mass popup tabs. You will need to click each generated link below to send the message via WhatsApp Web or Desktop.
                                </p>
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {leads
                                        .filter(l => selectedLeadIds.includes(l.id as string) && l.phone)
                                        .map((lead) => {
                                            // Format phone for WA (remove spaces, dashes)
                                            const formattedPhone = lead.phone?.replace(/[^0-9]/g, '');
                                            const waLink = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsAppMessage)}`;
                                            return (
                                                <div key={lead.id} className="flex items-center justify-between p-2 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
                                                    <div className="text-sm text-white font-medium">{lead.name}</div>
                                                    <a
                                                        href={waLink}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-xs font-medium px-3 py-1.5 rounded bg-green-500 hover:bg-green-600 text-white transition-colors"
                                                    >
                                                        Open WA
                                                    </a>
                                                </div>
                                            )
                                        })
                                    }
                                </div >
                            </div >

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setIsBulkWhatsAppModalOpen(false)}
                                    className="px-5 py-2.5 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-white font-medium transition-colors border border-transparent"
                                >
                                    Close
                                </button>
                            </div>
                        </div >
                    </div >
                </div >
            )}

            {/* Lead Details Modal */}
            {
                isLeadDetailsModalOpen && viewingLead && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-end p-0 sm:p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsLeadDetailsModalOpen(false)} />

                        <div className="relative w-full h-full sm:h-auto sm:max-w-md bg-[var(--bg-surface-elevated)] border-l sm:border border-[rgba(255,255,255,0.1)] sm:rounded-2xl shadow-2xl overflow-y-auto animate-in slide-in-from-right-1/2 duration-300">
                            <div className="sticky top-0 bg-[var(--bg-card)]/80 backdrop-blur-md p-4 flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] z-10">
                                <h2 className="text-xl font-display font-medium text-white">Lead Details</h2>
                                <button
                                    onClick={() => setIsLeadDetailsModalOpen(false)}
                                    className="text-[var(--text-muted)] hover:text-white transition-colors bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] p-1.5 rounded-full"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Profile Header */}
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--accent-orange)] to-rose-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                                        {viewingLead.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{viewingLead.name}</h3>
                                        <p className="text-[var(--text-secondary)]">{viewingLead.company || 'Unknown Company'}</p>
                                    </div>
                                </div>

                                {/* Info Blocks */}
                                <div className="space-y-4">
                                    <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4">
                                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1">Email</div>
                                        <div className="text-white break-all">{viewingLead.email || 'No email provided'}</div>
                                        {viewingLead.email && (
                                            <button
                                                onClick={() => { setIsLeadDetailsModalOpen(false); openEmailModal(viewingLead); }}
                                                className="mt-2 text-xs text-[var(--accent-cyan)] hover:underline flex items-center gap-1"
                                            >
                                                <Mail size={12} /> Send Email
                                            </button>
                                        )}
                                    </div>

                                    <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4">
                                        <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1">Phone</div>
                                        <div className="text-white">{viewingLead.phone || 'No phone provided'}</div>
                                        {viewingLead.phone && (
                                            <div className="mt-2 flex gap-3 text-xs">
                                                <a href={`tel:${viewingLead.phone}`} className="text-[var(--text-secondary)] hover:text-white flex items-center gap-1 transition-colors">
                                                    <Phone size={12} /> Call
                                                </a>
                                                <a href={`sms:${viewingLead.phone}`} className="text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors">
                                                    <MessageCircle size={12} /> WhatsApp/SMS
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-xl p-4 flex justify-between items-center">
                                        <div>
                                            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-1">Status</div>
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] border border-[rgba(255,255,255,0.1)]">
                                                {viewingLead.status.toUpperCase()}
                                            </span>
                                        </div>
                                        {/* Potential place to add a status dropdown changer in the future */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
