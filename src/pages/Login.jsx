import { useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import GoogleIcon from '@/components/GoogleIcon';
import BrandLogo from '@/components/BrandLogo';

export default function Login() {
  const buttonRef = useRef(null);
  const {
    isAuthenticated,
    isGoogleReady,
    googleClientId,
    authError,
    isFirebaseConfigured,
    renderGoogleButton,
    signInWithGoogle,
  } = useAuth();

  useEffect(() => {
    if (isGoogleReady && buttonRef.current) {
      buttonRef.current.innerHTML = '';
      renderGoogleButton(buttonRef.current, { width: 320, text: 'continue_with' });
    }
  }, [isGoogleReady, renderGoogleButton]);

  if (isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 text-foreground">
      <section className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-xl">
        <div className="mb-6 text-center">
          <BrandLogo className="justify-center" imageClassName="h-16" />
          <p className="mt-2 text-sm text-muted-foreground">Inicia sesion con Google</p>
        </div>

        {isFirebaseConfigured ? (
          <Button onClick={signInWithGoogle} disabled={!isGoogleReady} className="w-full gap-2 bg-white text-slate-900 hover:bg-slate-100">
            <GoogleIcon className="h-4 w-4" />
            Continuar con Google
          </Button>
        ) : googleClientId ? (
          <div className="flex justify-center" ref={buttonRef} />
        ) : (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive-foreground">
            Falta configurar VITE_GOOGLE_CLIENT_ID en el archivo .env.
          </div>
        )}

        {authError && (
          <p className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-red-300">
            {authError.type === 'user_not_registered'
              ? 'Tu usuario esta inactivo o no tiene acceso.'
              : authError.message}
          </p>
        )}
      </section>
    </div>
  );
}
