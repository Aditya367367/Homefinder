import React from "react";
import { FcGoogle } from "react-icons/fc";
import { useGoogleSignIn } from '../../services/GoogleSignIn.services'; 

const SocialLogin = () => {
   
    const { loginWithGoogle, isLoading } = useGoogleSignIn();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="flex-grow h-px bg-gray-600"></div>
                <span className="text-sm text-gray-400">or</span>
                <div className="flex-grow h-px bg-gray-600"></div>
            </div>

            <button
               
                onClick={() => loginWithGoogle()}
               
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 border border-gray-600 rounded-md py-2 hover:bg-white/10 transition"
            >
                <FcGoogle size={20} />
                <span className="text-sm font-medium">Login with Google</span>
            </button>
        </div>
    );
};

export default SocialLogin;