import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import PoemIntro from '@/components/features/PoemIntro';

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'rgb(5,7,15)' }}>
      <div className="font-orbitron text-2xl animate-pulse" style={{ color: '#00f0ff' }}>IQMAIL</div>
    </div>
  );

  return <PoemIntro />;
}
