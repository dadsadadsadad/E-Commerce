import React from 'react';
import { Link } from 'react-router-dom';

const NoAccess = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gray-100">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                You need to be signed in to use this feature.
            </h1>
            <Link
                to="/login"
                className="mt-2 px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
                Sign In
            </Link>
        </div>
    );
};

export default NoAccess;
