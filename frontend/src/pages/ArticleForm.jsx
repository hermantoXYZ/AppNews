import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import LoadingIndicator from '../components/LoadingIndicator';

function ArticleForm() {
    const navigate = useNavigate();
    const { slug } = useParams();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        summary: '',
        category: '',
        featured_image: null,
        status: 'draft'
    });

    useEffect(() => {
        fetchCategories();
        if (slug) {
            fetchArticle();
        }
    }, [slug]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/api/categories/');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        }
    };

    const fetchArticle = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/articles/${slug}/`);
            setFormData({
                title: response.data.title,
                content: response.data.content,
                summary: response.data.summary || '',
                category: response.data.category,
                status: response.data.status
            });
        } catch (error) {
            console.error('Error fetching article:', error);
            toast.error('Failed to load article');
            navigate('/articles');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'featured_image' && files) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        });

        try {
            if (slug) {
                await api.put(`/api/articles/${slug}/`, data);
                toast.success('Article updated successfully');
            } else {
                await api.post('/api/articles/', data);
                toast.success('Article created successfully');
            }
            navigate('/articles');
        } catch (error) {
            console.error('Error saving article:', error);
            toast.error('Failed to save article');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingIndicator />;

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>{slug ? 'Edit Article' : 'Create New Article'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Article Title"
                                required
                            />
                        </div>

                        <div>
                            <Select
                                name="category"
                                value={formData.category}
                                onValueChange={(value) => handleChange({ target: { name: 'category', value }})}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Textarea
                                name="summary"
                                value={formData.summary}
                                onChange={handleChange}
                                placeholder="Article Summary"
                                className="h-20"
                            />
                        </div>

                        <div>
                            <Textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Article Content"
                                className="h-64"
                                required
                            />
                        </div>

                        <div>
                            <Input
                                type="file"
                                name="featured_image"
                                onChange={handleChange}
                                accept="image/*"
                            />
                        </div>

                        <div>
                            <Select
                                name="status"
                                value={formData.status}
                                onValueChange={(value) => handleChange({ target: { name: 'status', value }})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : (slug ? 'Update' : 'Create')}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => navigate('/articles')}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default ArticleForm; 