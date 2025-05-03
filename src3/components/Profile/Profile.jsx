import React, { useState, useEffect } from 'react';
import { auth } from '../../services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await auth.getProfile();
      setProfile(data);
    } catch (error) {
      toast.error(error.message || 'Failed to load profile');
      setProfile(null);
    }
  };

  if (!profile) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-xl text-gray-600">
        Unable to load profile. Please try again later.
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <div className="text-lg">{profile.name}</div>
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <div className="text-lg">{profile.email}</div>
          </div>
          <div>
            <label className="block text-gray-700">Role</label>
            <div className="text-lg capitalize">{profile.role}</div>
          </div>
          <div>
            <label className="block text-gray-700">Member Since</label>
            <div className="text-lg">{new Date(profile.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
