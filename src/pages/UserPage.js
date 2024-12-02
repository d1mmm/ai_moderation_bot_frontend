import React, { useEffect, useState } from 'react';

const UserPage = () => {
    const [stats, setStats] = useState({});
    const [error, setError] = useState('');
    const [searchNickname, setSearchNickname] = useState('');
    const [filteredStats, setFilteredStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("Token")
                console.log(token)

                const response =await fetch("http://127.0.0.1:8000/content-stats", {
                    method: "GET",
                    headers: {
                        "Authorization": `${token}`,
                        "Content-Type": "application/json"
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch content stats");
                }
                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchStats();
    }, []);

    useEffect(() => {
        if (searchNickname.trim() === '') {
            setFilteredStats(null);
            return;
        }

        const filtered = Object.entries(stats).filter(([username]) =>
            username.toLowerCase().includes(searchNickname.toLowerCase())
        );

        setFilteredStats(Object.fromEntries(filtered));
    }, [searchNickname, stats]);

    return (
        <div className="user-page">
            <div className="header">
                <h1>Content Statistics</h1>
                <input 
                    type="text" 
                    placeholder="Search by nickname" 
                    value={searchNickname} 
                    onChange={(e) => setSearchNickname(e.target.value)} 
                    className="search-input"
                />
            </div>

            {error && <p className="error-message">{error}</p>}
            
            <table>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Allowed Content</th>
                        <th>Blocked Content</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStats ? (
                        Object.entries(filteredStats).map(([username, counts]) => (
                            <tr key={username}>
                                <td>{username}</td>
                                <td>{counts.allowed_count}</td>
                                <td>{counts.blocked_count}</td>
                            </tr>
                        ))
                    ) : (
                        Object.entries(stats).map(([username, counts]) => (
                            <tr key={username}>
                                <td>{username}</td>
                                <td>{counts.allowed_count}</td>
                                <td>{counts.blocked_count}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {filteredStats && Object.keys(filteredStats).length === 0 && (
                <p>No results found for "{searchNickname}".</p>
            )}
        </div>
    );
};

export default UserPage;
