import React from 'react';

// --- MOCK DATA ---
const allClubs = [
    { id: 1, name: 'Coding Community', members: 120, category: 'Tech', img: 'https://placehold.co/200x200/3B82F6/FFFFFF?text=CC', description: 'For all students passionate about software development and technology.'},
    { id: 2, name: 'Design Hub', members: 85, category: 'Creative', img: 'https://placehold.co/200x200/8B5CF6/FFFFFF?text=DH', description: 'A place for designers to collaborate, learn, and create stunning visuals.' },
    { id: 3, name: 'Entrepreneurship Society', members: 95, category: 'Business', img: 'https://placehold.co/200x200/F59E0B/FFFFFF?text=ES', description: 'Connect with aspiring entrepreneurs and build the next big thing.'},
    { id: 4, name: 'Photography Club', members: 60, category: 'Creative', img: 'https://placehold.co/200x200/10B981/FFFFFF?text=PC', description: 'Capture the world through your lens. All skill levels welcome.' },
    { id: 5, name: 'AI & Robotics', members: 78, category: 'Tech', img: 'https://placehold.co/200x200/EF4444/FFFFFF?text=AI', description: 'Explore the frontiers of Artificial Intelligence and build cool robots.' },
    { id: 6, name: 'Debate Union', members: 45, category: 'Academic', img: 'https://placehold.co/200x200/6366F1/FFFFFF?text=DU', description: 'Sharpen your wit and engage in intellectual discourse on pressing topics.' },
];

// A map for category colors
const categoryColors = {
    Tech: 'bg-blue-100 text-blue-800',
    Creative: 'bg-purple-100 text-purple-800',
    Business: 'bg-amber-100 text-amber-800',
    Academic: 'bg-indigo-100 text-indigo-800'
}

/**
 * ClubsPage Component
 * Displays a searchable and filterable list of all student clubs.
 */
export default function ClubsPage() {
    return (
        <div className="p-4 sm:p-8">
            <h1 className="text-3xl font-bold mb-2">Discover Clubs</h1>
            <p className="text-gray-600 mb-6">Find your passion and connect with like-minded students.</p>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 mb-6 bg-white p-3 rounded-lg shadow-sm">
                <button className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full">All</button>
                <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full">Tech</button>
                <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full">Creative</button>
                <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full">Business</button>
                <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full">Academic</button>
            </div>

            {/* Clubs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allClubs.map(club => (
                    <div key={club.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                        <img src={club.img} alt={`${club.name} banner`} className="w-full h-32 object-cover" />
                        <div className="p-5 flex flex-col flex-grow">
                            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2 self-start ${categoryColors[club.category] || 'bg-gray-100 text-gray-800'}`}>{club.category}</span>
                            <h3 className="text-xl font-bold mb-1">{club.name}</h3>
                            <p className="text-gray-500 text-sm mb-3">{club.members} members</p>
                            <p className="text-gray-700 text-sm mb-4 flex-grow">{club.description}</p>
                            <button className="w-full mt-auto bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
