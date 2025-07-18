import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';

export default function Onboarding() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check if user already has onboarding data
        const docRef = doc(db, 'users', currentUser.uid);
        getDoc(docRef).then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setRole(data.role || '');
            setDepartment(data.department || '');
            setLevel(data.level || '');
            // If all data exists, redirect to dashboard
            if (data.role && data.department && data.level) {
              router.push('/dashboard');
            }
          }
        });
      } else {
        router.push('/'); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid), {
          role,
          department,
          level,
        }, { merge: true });
        alert('Onboarding profile saved!');
        router.push('/dashboard');
      } catch (error) {
        alert(error.message);
      }
    }
  };

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Complete Your Onboarding Profile
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="role" className="sr-only">Role</label>
              <select
                id="role"
                name="role"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select Role</option>
                <option value="sales">Sales</option>
                <option value="engineering">Engineering</option>
              </select>
            </div>
            <div>
              <label htmlFor="department" className="sr-only">Department</label>
              <input
                id="department"
                name="department"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="level" className="sr-only">Seniority Level</label>
              <select
                id="level"
                name="level"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="">Select Seniority Level</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


