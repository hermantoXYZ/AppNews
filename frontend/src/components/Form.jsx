import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Form({ route, method }) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        bio: "",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        if (method === "login") {
            if (!formData.username || !formData.password) {
                toast.error("Username dan password harus diisi");
                setLoading(false);
                return;
            }
        } else {
            // Validation for registration
            if (!formData.username || !formData.password || !formData.email) {
                toast.error("Username, password, dan email harus diisi");
                setLoading(false);
                return;
            }
        }

        try {
            const dataToSend = method === "login" 
                ? { username: formData.username, password: formData.password }
                : { ...formData, role: 'contributor' };

            const res = await api.post(route, dataToSend)
            if (method === "login") {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                toast.success("Login berhasil");
                navigate("/dashboard")
            } else {
                toast.success("Registrasi berhasil");
                navigate("/login")
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        toast.error("Username atau password salah");
                        break;
                    case 400:
                        toast.error("Data yang dimasukkan tidak valid");
                        break;
                    case 404:
                        toast.error("Server tidak ditemukan");
                        break;
                    case 500:
                        toast.error("Terjadi kesalahan pada server");
                        break;
                    default:
                        toast.error(method === "login" ? "Gagal login" : "Gagal registrasi");
                }
            } else if (error.request) {
                toast.error("Tidak dapat terhubung ke server");
            } else {
                toast.error("Terjadi kesalahan. Silakan coba lagi");
            }
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="space-y-4">
        <Card className="w-[420px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">{name}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Username"
                            required
                        />
                    </div>
                    {method === "register" && (
                        <>
                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    name="first_name"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    placeholder="Nama Depan"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    name="last_name"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    placeholder="Nama Belakang"
                                />
                            </div>
                            <div className="space-y-2">
                                <Input
                                    type="text"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Bio (opsional)"
                                />
                            </div>
                        </>
                    )}
                    <div className="space-y-2">
                        <Input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                        />
                    </div>
                    {loading && <LoadingIndicator />}
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Loading..." : name}
                    </Button>
                </form>
                {method === "login" && (
                    <p className="text-sm text-gray-600 text-center mt-4">Belum punya akun? <a href="/register" className="text-blue-600 hover:underline">Create Accounts</a></p>
                )}
                {method === "register" && (
                     <p className="text-sm text-gray-600 text-center mt-4">
                     Sudah punya akun? <a href="/login" className="text-blue-600 hover:underline">Login disini</a>
                 </p>
                )}
            </CardContent>
        </Card>
        <Toaster />
        </div>
    );
}

export default Form