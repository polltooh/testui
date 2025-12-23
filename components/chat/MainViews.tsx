'use client';
import { useState } from 'react';
import { Search, Upload, Calendar, MapPin, Star, TrendingUp, FileText, Stethoscope } from 'lucide-react';

// Doctors View Component
export function DoctorsView() {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock doctor data
  const mockDoctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiologist',
      rating: 4.9,
      experience: '15 years',
      location: 'New York, NY',
      available: true
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Neurologist',
      rating: 4.8,
      experience: '12 years',
      location: 'San Francisco, CA',
      available: false
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Dermatologist',
      rating: 4.7,
      experience: '10 years',
      location: 'Los Angeles, CA',
      available: true
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Orthopedic Surgeon',
      rating: 4.9,
      experience: '18 years',
      location: 'Boston, MA',
      available: true
    },
    {
      id: 5,
      name: 'Dr. Lisa Anderson',
      specialty: 'Pediatrician',
      rating: 4.8,
      experience: '14 years',
      location: 'Chicago, IL',
      available: true
    },
    {
      id: 6,
      name: 'Dr. Robert Taylor',
      specialty: 'Psychiatrist',
      rating: 4.6,
      experience: '11 years',
      location: 'Seattle, WA',
      available: false
    }
  ];

  const filteredDoctors = mockDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-[#fcfcfd] p-8">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Find a Doctor (Fake)</h1>
        <p className="text-slate-600 mb-8">Search and connect with healthcare professionals</p>

        {/* Recent Diagnoses */}
        <div className="mb-6 p-4 bg-cyan-50 border border-cyan-100 rounded-2xl">
          <h2 className="text-sm font-bold text-cyan-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Recent Diagnoses
          </h2>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-cyan-100 shadow-sm text-sm">
              <span className="font-semibold text-slate-900">Migraine</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 text-xs">Dec 22, 2024</span>
              <button className="ml-1 text-cyan-600 hover:text-cyan-700 text-xs font-semibold">
                Find Specialist
              </button>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl border border-cyan-100 shadow-sm text-sm">
              <span className="font-semibold text-slate-900">Seasonal Allergies</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 text-xs">Dec 15, 2024</span>
              <button className="ml-1 text-cyan-600 hover:text-cyan-700 text-xs font-semibold">
                Find Specialist
              </button>
            </div>
          </div>
        </div>

        {/* Last Visited Doctor */}
        <div className="mb-8 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
          <h2 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            Last Visited Doctor
          </h2>
          <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-indigo-100 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
              JS
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Dr. Jennifer Smith</h3>
              <p className="text-xs text-slate-500">General Practitioner • Palo Alto Medical Foundation</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-900">Dec 10, 2024</p>
              <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-semibold rounded-full">
                Completed
              </span>
            </div>
            <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-all">
              Book Again
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="p-5 bg-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-base text-slate-900">{doctor.name}</h3>
                    {doctor.available && (
                      <span className="flex-shrink-0 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        Available
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{doctor.specialty}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-medium">{doctor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{doctor.experience}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{doctor.location}</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Records View Component
export function RecordsView() {
  const [dragActive, setDragActive] = useState(false);

  // Mock uploaded records
  const mockRecords = [
    { id: 1, name: 'Blood Test Results.pdf', date: '2024-12-15', size: '2.3 MB', type: 'Lab Report' },
    { id: 2, name: 'X-Ray Chest.jpg', date: '2024-12-10', size: '4.1 MB', type: 'Imaging' },
    { id: 3, name: 'Prescription.pdf', date: '2024-12-05', size: '156 KB', type: 'Prescription' },
    { id: 4, name: 'MRI Scan Brain.dcm', date: '2024-11-28', size: '12.5 MB', type: 'Imaging' },
    { id: 5, name: 'Vaccination Record.pdf', date: '2024-11-15', size: '890 KB', type: 'Immunization' },
    { id: 6, name: 'ECG Report.pdf', date: '2024-11-01', size: '1.2 MB', type: 'Cardiology' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#fcfcfd] p-8">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Medical Records (Fake)</h1>
        <p className="text-slate-600 mb-8">Upload and manage your medical documents</p>

        {/* Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all mb-8 ${dragActive
            ? 'border-cyan-500 bg-cyan-50'
            : 'border-slate-300 bg-white hover:border-slate-400'
            }`}
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            // Handle file drop (mocked for now)
          }}
        >
          <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <p className="text-lg font-semibold text-slate-700 mb-2">Upload Medical Records</p>
          <p className="text-sm text-slate-500 mb-6">Drag & drop files here or click to browse</p>
          <button className="px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all">
            Choose Files
          </button>
          <p className="text-xs text-slate-400 mt-4">Supported formats: PDF, JPG, PNG, DICOM (up to 25MB)</p>
        </div>

        {/* Recent Records */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Records</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRecords.map((record) => (
              <div
                key={record.id}
                className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 truncate mb-1">{record.name}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-slate-500">{record.date}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">{record.size}</span>
                    </div>
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                      {record.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Explore View Component
export function ExploreView() {
  // Mock news/articles data
  const mockNews = [
    {
      id: 1,
      title: 'New Breakthrough in Cancer Treatment Shows Promise',
      source: 'Medical News Today',
      date: '2 hours ago',
      category: 'Research',
      image: '🔬',
      excerpt: 'Researchers have discovered a novel approach to targeting cancer cells that could revolutionize treatment options.'
    },
    {
      id: 2,
      title: 'Understanding Heart Health: 10 Essential Tips for a Healthy Heart',
      source: 'Health Magazine',
      date: '5 hours ago',
      category: 'Wellness',
      image: '❤️',
      excerpt: 'Learn the most effective strategies for maintaining cardiovascular health and preventing heart disease.'
    },
    {
      id: 3,
      title: 'Mental Health Awareness: Breaking the Stigma in Modern Society',
      source: 'Psychology Today',
      date: '1 day ago',
      category: 'Mental Health',
      image: '🧠',
      excerpt: 'Experts discuss the importance of mental health awareness and how to support those struggling with mental illness.'
    },
    {
      id: 4,
      title: 'The Future of Telemedicine: What to Expect in 2025',
      source: 'Tech Health',
      date: '2 days ago',
      category: 'Technology',
      image: '💻',
      excerpt: 'Telemedicine continues to evolve with AI integration and improved accessibility for patients worldwide.'
    },
    {
      id: 5,
      title: 'Nutrition Guide for Better Sleep: Foods That Help You Rest',
      source: 'Wellness Weekly',
      date: '3 days ago',
      category: 'Nutrition',
      image: '🥗',
      excerpt: 'Discover which foods can improve your sleep quality and which ones to avoid before bedtime.'
    },
    {
      id: 6,
      title: 'Exercise and Immunity: How Physical Activity Boosts Your Immune System',
      source: 'Fitness Journal',
      date: '4 days ago',
      category: 'Fitness',
      image: '💪',
      excerpt: 'Regular exercise has been shown to strengthen the immune system and reduce the risk of illness.'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#fcfcfd] p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="w-8 h-8 text-cyan-600" />
          <h1 className="text-3xl font-bold text-slate-900">Explore Health News (Fake)</h1>
        </div>
        <p className="text-slate-600 mb-8">Stay updated with the latest health and wellness articles</p>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockNews.map((article) => (
            <div
              key={article.id}
              className="p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-cyan-100 to-indigo-100 flex items-center justify-center text-4xl flex-shrink-0">
                  {article.image}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{article.excerpt}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-slate-500 font-medium">{article.source}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500">{article.date}</span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
