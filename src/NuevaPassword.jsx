import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom'; 
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "./firebase/firebase"; 
import { Eye, EyeOff } from 'lucide-react'; 

export default function NuevaPassword() {
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [showPassword, setShowPassword] = useState(false);
    
    const [searchParams] = useSearchParams();
    const oobCode = searchParams.get('oobCode'); 

    const calcularFortaleza = (pwd) => {
        let score = 0;
        if (pwd.length >= 12) score += 1;
        if (/[A-Z]/.test(pwd)) score += 1;
        if (/[0-9]/.test(pwd)) score += 1;
        if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
        return score;
    };

    const getFortalezaUI = (score) => {
        if (nuevaPassword.length === 0) return { texto: "Sin ingresar", bg: "bg-gray-200", color: "text-gray-400" };
        if (score <= 1) return { texto: "Débil", bg: "bg-red-500", color: "text-red-500" };
        if (score === 2) return { texto: "Regular", bg: "bg-amber-500", color: "text-amber-500" };
        if (score === 3) return { texto: "Buena", bg: "bg-emerald-400", color: "text-emerald-500" };
        return { texto: "Fuerte", bg: "bg-emerald-600", color: "text-emerald-600" };
    };

    const scorePwd = calcularFortaleza(nuevaPassword);
    const uiFortaleza = getFortalezaUI(scorePwd);

    const handleCambiarPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMensaje('');

        if (!oobCode) {
            setError('El enlace es inválido o ya expiró. Vuelve a solicitar el cambio de contraseña.');
            return;
        }

        if (scorePwd < 4) {
            setError('La contraseña no cumple con los requisitos de seguridad.');
            return;
        }

        setLoading(true);

        try {
            await confirmPasswordReset(auth, oobCode, nuevaPassword);
            setMensaje('¡Contraseña actualizada con éxito!');
            
            setTimeout(() => {
                window.location.href = 'https://comisariato-plataform.web.app/login'; 
            }, 3000);
            
        } catch (err) {
            console.error(err);
            setError('Hubo un error al cambiar la contraseña. El enlace pudo haber expirado.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative">
            
            <style>{`
                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus, 
                input:-webkit-autofill:active {
                    -webkit-box-shadow: 0 0 0 30px #F5F3FF inset !important;
                    -webkit-text-fill-color: #020817 !important;
                    border-radius: 0.75rem !important;
                }
            `}</style>

            <div className="w-40 h-40 bg-purple-100 rounded-full flex items-center justify-center -mb-8 relative z-10 shadow-sm border-4 border-white">
                <img src="/IMGRecuperar.png" alt="Recuperar" className="w-40 h-auto -mb-8 relative z-10" />            
            </div>

            <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-md p-8 md:p-10 relative z-0 text-center">
                
                <h2 className="text-[22px] font-bold text-[#020817] mb-2 mt-4">
                    Crear Nueva Contraseña
                </h2>
                <p className="text-[11px] text-gray-500 font-medium mb-8">
                    Ingresa tu nueva contraseña para acceder al portal.
                </p>

                {mensaje && (
                    <div className="mb-6 p-3 bg-green-50 text-green-600 text-[11px] font-bold rounded-xl border border-green-100">
                        {mensaje} Redirigiendo al login...
                    </div>
                )}
                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-500 text-[11px] font-bold rounded-xl border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleCambiarPassword} className="text-left space-y-6">
                    <div>
                        <label className="block text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                            Nueva Contraseña
                        </label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                value={nuevaPassword}
                                onChange={(e) => setNuevaPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-[#F8FAFC] border border-gray-100 text-sm font-medium pl-4 pr-12 py-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
                            />
                            
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#7C3AED] transition-colors focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* --- UI DEL MEDIDOR DE FORTALEZA --- */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Fortaleza</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${uiFortaleza.color}`}>{uiFortaleza.texto}</span>
                        </div>
                        <div className="flex gap-1.5 h-1.5 w-full">
                            {[1, 2, 3, 4].map((level) => (
                                <div key={level} className={`flex-1 rounded-full transition-colors duration-300 ${scorePwd >= level ? uiFortaleza.bg : 'bg-gray-200'}`}></div>
                            ))}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-3 leading-tight font-medium">
                            Debe contener al menos 12 caracteres, 1 mayúscula, 1 número y 1 símbolo especial.
                        </p>
                    </div>
                    {/* ----------------------------------- */}

                    <button 
                        type="submit" 
                        disabled={loading || !oobCode || scorePwd < 4}
                        className={`w-full text-white text-[10px] font-bold px-4 py-4 rounded-xl uppercase tracking-widest transition-all
                            ${loading || !oobCode || scorePwd < 4 ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-[#020817] hover:bg-black shadow-md'}
                        `}
                    >
                        {loading ? 'Guardando...' : 'GUARDAR CONTRASEÑA'}
                    </button>
                </form>
            </div>
        </div>
    );
}