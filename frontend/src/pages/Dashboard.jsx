import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import api from '../api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, FolderOpen, Eye, Clock, Pencil, Trash2, ExternalLink } from "lucide-react";
import DashboardLayout from '../components/DashboardLayout';
import LoadingIndicator from '../components/LoadingIndicator';
import { toast } from "sonner";

function Dashboard() {
    // Stats State
    const [stats, setStats] = useState({
        totalArticles: 0,
        publishedArticles: 0,
        draftArticles: 0,
        categories: 0,
        totalViews: 0
    });

    const location = useLocation();
    
    // Articles State
    const [articles, setArticles] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Categories State
    const [categories, setCategories] = useState([]);
    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: ''
    });
    const [editingCategory, setEditingCategory] = useState(null);

    // Article Form State
    const [articleForm, setArticleForm] = useState({
        title: '',
        content: '',
        summary: '',
        category: '',
        featured_image: null,
        status: 'draft'
    });

    // UI State
    const [activeSection, setActiveSection] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [articlesRes, categoriesRes, myArticlesRes] = await Promise.all([
                api.get('/api/articles/'),
                api.get('/api/categories/'),
                api.get('/api/articles/my_articles/')
            ]);

            const articles = myArticlesRes.data;
            const totalViews = articles.reduce((sum, article) => sum + article.views_count, 0);

            setStats({
                totalArticles: articles.length,
                publishedArticles: articles.filter(a => a.status === 'published').length,
                draftArticles: articles.filter(a => a.status === 'draft').length,
                categories: categoriesRes.data.length,
                totalViews
            });

            setArticles(articles);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await api.put(`/api/categories/${editingCategory.id}/`, categoryForm);
                toast.success('Category updated successfully');
            } else {
                await api.post('/api/categories/', categoryForm);
                toast.success('Category created successfully');
            }
            setCategoryForm({ name: '', description: '' });
            setEditingCategory(null);
            fetchDashboardData();
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error('Failed to save category');
        }
    };

    const handleArticleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(articleForm).forEach(key => {
            if (articleForm[key] !== null) {
                formData.append(key, articleForm[key]);
            }
        });

        try {
            await api.post('/api/articles/', formData);
            toast.success('Article created successfully');
            setArticleForm({
                title: '',
                content: '',
                summary: '',
                category: '',
                featured_image: null,
                status: 'draft'
            });
            fetchDashboardData();
            setActiveSection('articles');
        } catch (error) {
            console.error('Error creating article:', error);
            toast.error('Failed to create article');
        }
    };

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
                                    <FileText className="h-4 w-4 text-gray-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalArticles}</div>
                                    <p className="text-xs text-gray-500">
                                        {stats.publishedArticles} published, {stats.draftArticles} drafts
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Categories</CardTitle>
                                    <FolderOpen className="h-4 w-4 text-gray-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.categories}</div>
                                    <p className="text-xs text-gray-500">Total categories</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                                    <Eye className="h-4 w-4 text-gray-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.totalViews}</div>
                                    <p className="text-xs text-gray-500">All time article views</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">Draft Articles</CardTitle>
                                    <Clock className="h-4 w-4 text-gray-500" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stats.draftArticles}</div>
                                    <p className="text-xs text-gray-500">Pending publication</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Recent Articles */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Articles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {articles.slice(0, 5).map((article) => (
                                        <div
                                            key={article.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex-1">
                                                <Link
                                                    to={`/articles/${article.slug}`}
                                                    className="text-lg font-medium hover:text-blue-600"
                                                >
                                                    {article.title}
                                                </Link>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                    <span>{article.category_name}</span>
                                                    <span>•</span>
                                                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>{article.views_count} views</span>
                                                </div>
                                            </div>
                                            <div className={`
                                                px-3 py-1 rounded-full text-sm
                                                ${article.status === 'published'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }
                                            `}>
                                                {article.status}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );

            case 'categories':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCategorySubmit} className="space-y-4">
                                    <div>
                                        <Input
                                            type="text"
                                            value={categoryForm.name}
                                            onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                                            placeholder="Category Name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Textarea
                                            value={categoryForm.description}
                                            onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder="Category Description"
                                            className="h-32"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button type="submit">
                                            {editingCategory ? 'Update' : 'Create'}
                                        </Button>
                                        {editingCategory && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setCategoryForm({ name: '', description: '' });
                                                    setEditingCategory(null);
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Categories List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Categories</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {categories.map((category) => (
                                        <div
                                            key={category.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <h3 className="font-medium">{category.name}</h3>
                                                {category.description && (
                                                    <p className="text-sm text-gray-600">{category.description}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingCategory(category);
                                                        setCategoryForm({
                                                            name: category.name,
                                                            description: category.description || ''
                                                        });
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={async () => {
                                                        if (window.confirm('Are you sure you want to delete this category?')) {
                                                            try {
                                                                await api.delete(`/api/categories/${category.id}/`);
                                                                toast.success('Category deleted successfully');
                                                                fetchDashboardData();
                                                            } catch (error) {
                                                                console.error('Error deleting category:', error);
                                                                toast.error('Failed to delete category');
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                );

            case 'new-article':
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Article</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleArticleSubmit} className="space-y-4">
                                <div>
                                    <Input
                                        type="text"
                                        value={articleForm.title}
                                        onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Article Title"
                                        required
                                    />
                                </div>

                                <div>
                                    <Select
                                        value={articleForm.category}
                                        onValueChange={(value) => setArticleForm(prev => ({ ...prev, category: value }))}
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
                                        value={articleForm.summary}
                                        onChange={(e) => setArticleForm(prev => ({ ...prev, summary: e.target.value }))}
                                        placeholder="Article Summary"
                                        className="h-20"
                                    />
                                </div>

                                <div>
                                    <Textarea
                                        value={articleForm.content}
                                        onChange={(e) => setArticleForm(prev => ({ ...prev, content: e.target.value }))}
                                        placeholder="Article Content"
                                        className="h-64"
                                        required
                                    />
                                </div>

                                <div>
                                    <Input
                                        type="file"
                                        onChange={(e) => setArticleForm(prev => ({ ...prev, featured_image: e.target.files[0] }))}
                                        accept="image/*"
                                    />
                                </div>

                                <div>
                                    <Select
                                        value={articleForm.status}
                                        onValueChange={(value) => setArticleForm(prev => ({ ...prev, status: value }))}
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

                                <div className="flex gap-2">
                                    <Button type="submit">Create Article</Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setActiveSection('articles')}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                );

            case 'articles':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">My Articles</h2>
                            <Button onClick={() => setActiveSection('new-article')}>
                                Create New Article
                            </Button>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Filter by Category</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        variant={!selectedCategory ? "default" : "outline"}
                                        onClick={() => setSelectedCategory(null)}
                                    >
                                        All
                                    </Button>
                                    {categories.map((category) => (
                                        <Button
                                            key={category.id}
                                            variant={selectedCategory === category.slug ? "default" : "outline"}
                                            onClick={() => setSelectedCategory(category.slug)}
                                        >
                                            {category.name}
                                        </Button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.map((article) => (
                                <Card key={article.id} className="flex flex-col">
                                    {article.featured_image && (
                                        <img
                                            src={article.featured_image}
                                            alt={article.title}
                                            className="w-full h-48 object-cover rounded-t-lg"
                                        />
                                    )}
                                    <CardHeader>
                                        <CardTitle className="text-xl">
                                            <Link to={`/articles/${article.slug}`} className="hover:text-blue-600">
                                                {article.title}
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                            <span>{article.category_name}</span>
                                            <span>•</span>
                                            <span>{new Date(article.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-700 line-clamp-3">{article.summary}</p>
                                    </CardContent>
                                    <CardContent className="mt-auto">
                                        <div className="flex justify-between items-center">
                                            <div className={`
                                                px-2 py-1 rounded-full text-sm
                                                ${article.status === 'published'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }
                                            `}>
                                                {article.status}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    {article.views_count}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link to={`/articles/${article.slug}`}>
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    asChild
                                                >
                                                    <Link to={`/articles/edit/${article.slug}`}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={async () => {
                                                        if (window.confirm('Are you sure you want to delete this article?')) {
                                                            try {
                                                                await api.delete(`/api/articles/${article.slug}/`);
                                                                toast.success('Article deleted successfully');
                                                                fetchDashboardData();
                                                            } catch (error) {
                                                                console.error('Error deleting article:', error);
                                                                toast.error('Failed to delete article');
                                                            }
                                                        }
                                                    }}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) return <LoadingIndicator />;

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Navigation Tabs */}
                <div className="flex gap-2 border-b">
                    <Button
                        variant={activeSection === 'overview' ? 'default' : 'ghost'}
                        onClick={() => setActiveSection('overview')}
                    >
                        Overview
                    </Button>
                    <Button
                        variant={activeSection === 'articles' ? 'default' : 'ghost'}
                        onClick={() => setActiveSection('articles')}
                    >
                        Articles
                    </Button>
                    <Button
                        variant={activeSection === 'categories' ? 'default' : 'ghost'}
                        onClick={() => setActiveSection('categories')}
                    >
                        Categories
                    </Button>
                </div>

                {/* Content */}
                {renderContent()}
            </div>
        </DashboardLayout>
    );
}

export default Dashboard; 