import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { templates } from '../data/templates';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [checklist, setChecklist] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setProfile(userData);

          // Generate checklist based on profile
          if (userData.role && userData.level) {
            const userChecklist = templates[userData.role]?.[userData.level]?.map(task => ({
              task,
              completed: userData.completedTasks?.[task] || false,
            })) || [];
            setChecklist(userChecklist);
          } else {
            router.push('/onboarding'); // Redirect if profile is incomplete
          }
        } else {
          router.push('/onboarding'); // Redirect if no profile exists
        }
      } else {
        router.push('/'); // Redirect to login if not authenticated
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleTaskToggle = async (taskName) => {
    if (user && profile) {
      const updatedChecklist = checklist.map(item =>
        item.task === taskName ? { ...item, completed: !item.completed } : item
      );
      setChecklist(updatedChecklist);

      const completedTasks = updatedChecklist.reduce((acc, item) => {
        if (item.completed) {
          acc[item.task] = true;
        }
        return acc;
      }, {});

      try {
        await updateDoc(doc(db, 'users', user.uid), {
          completedTasks,
        });
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const progress = checklist.length > 0
    ? (checklist.filter(item => item.completed).length / checklist.length) * 100
    : 0;

  if (!user || !profile) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome, {user.email}!</h1>
        <p className="text-lg text-gray-700 mb-6">Your Onboarding Checklist ({profile.role} - {profile.level})</p>

        <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
          <div
            className="bg-indigo-600 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-right text-sm text-gray-600 mb-6">{progress.toFixed(0)}% Complete</p>

        <ul className="space-y-3">
          {checklist.map((item, index) => (
            <li key={index} className="flex items-center bg-gray-50 p-3 rounded-md shadow-sm">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleTaskToggle(item.task)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className={`ml-3 text-lg ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                {item.task}
              </span>
            </li>
          ))}
        </ul>

        <button
          onClick={() => auth.signOut().then(() => router.push('/'))}
          className="mt-8 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}


