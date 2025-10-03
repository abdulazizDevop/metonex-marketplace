import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavigation from '../../components/BottomNavigation';
import userApi from '../../utils/userApi';

const SupplierAddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: null,
    factory: null,
    brand: "",
    grade: "",
    unit: null,
    base_price: "",
    currency: "UZS",
    min_order_quantity: "",
    delivery_locations: "",
    specifications: "",
    material: "",
    origin_country: "",
    warranty_period: "",
    photos: [],
    certificates: [],
    is_active: true,
    is_featured: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Dynamic data from backend
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [factories, setFactories] = useState([]);

  // Load data from backend
  useEffect(() => {
    loadMetadata();
  }, []);

  const loadMetadata = async () => {
    try {
      const [categoriesRes, factoriesRes] = await Promise.allSettled([
        userApi.getCategories(),
        userApi.getFactories()
      ]);

      if (categoriesRes.status === 'fulfilled') {
        const categoriesData = categoriesRes.value.results || categoriesRes.value || [];
        setCategories(categoriesData);
      }

      if (factoriesRes.status === 'fulfilled') {
        const factoriesData = factoriesRes.value.results || factoriesRes.value || [];
        setFactories(factoriesData);
      }
    } catch (error) {
      console.error('Metadata yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  // Kategoriya tanlanganda units ni yuklash
  const loadUnitsForCategory = async (categoryId) => {
    if (!categoryId) return;
    
    try {
      const response = await userApi.getUnits(categoryId);
      const unitsData = response.results || response || [];
      setUnits(unitsData);
      
      // Agar faqat bitta unit bo'lsa, uni avtomatik tanlash
      if (unitsData.length === 1) {
        setFormData(prev => ({ ...prev, unit: unitsData[0].id }));
      }
    } catch (error) {
      console.error('Kategoriya uchun units yuklashda xatolik:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Agar kategoriya o'zgargan bo'lsa, units ni reset qilish va yangi units yuklash
      if (field === 'category') {
        newData.unit = null; // Unit ni reset qilish
        loadUnitsForCategory(value); // Yangi units yuklash
      }
      
      return newData;
    });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleFileUpload = (field, files) => {
    if (field === "certificates") {
      setFormData(prev => ({
        ...prev,
        certificates: Array.from(files)
      }));
    } else if (field === "photos") {
      setFormData(prev => ({
        ...prev,
        photos: Array.from(files)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = "Kategoriya tanlash kerak";
    if (!formData.factory) newErrors.factory = "Zavod tanlash kerak";
    if (!formData.brand) newErrors.brand = "Brand majburiy";
    if (!formData.grade) newErrors.grade = "Grade majburiy";
    if (!formData.base_price || formData.base_price <= 0) newErrors.base_price = "To'g'ri narx kiriting";
    if (!formData.min_order_quantity || formData.min_order_quantity <= 0) newErrors.min_order_quantity = "To'g'ri minimal buyurtma kiriting";
    if (formData.photos.length === 0) newErrors.photos = "Kamida bitta rasm kerak";

    // Material va specifications ixtiyoriy - validation yo'q
    // Unit avtomatik tanlanadi kategoriya asosida

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Creating product with data:", formData);
      
      const response = await userApi.createProduct(formData);
      
      console.log("Product created successfully:", response);
      
      alert("Mahsulot muvaffaqiyatli qo'shildi!");
      navigate("/seller/products");
      
    } catch (error) {
      console.error("Mahsulot qo'shishda xatolik:", error);
      
      // Handle validation errors from backend
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        alert("Mahsulot qo'shishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/seller/products");
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between group/design-root bg-white">
      <div className="flex-grow">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center px-4 py-3">
            <button 
              onClick={handleCancel}
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <line x1="18" x2="6" y1="6" y2="18"></line>
                <line x1="6" x2="18" y1="6" y2="18"></line>
              </svg>
            </button>
            <h1 className="flex-1 text-center text-xl font-semibold text-gray-900">Mahsulot qo'shish</h1>
            <div className="w-6"></div>
          </div>
          <div className="h-px bg-gray-200"></div>
        </header>

        <main className="px-4 py-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6C4FFF] mx-auto mb-4"></div>
              <p className="text-gray-500">Ma'lumotlar yuklanmoqda...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">1-qadam: Kategoriya tanlash</h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <label 
                    key={category.id}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      formData.category === category.id 
                        ? "border-[#6C4FFF] bg-[#6C4FFF]/10" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input 
                      type="radio"
                      name="category"
                      value={category.id}
                      checked={formData.category === category.id}
                      onChange={(e) => handleInputChange("category", parseInt(e.target.value))}
                      className="h-4 w-4 border-gray-300 text-[#6C4FFF] focus:ring-[#6C4FFF]"
                    />
                    <span className="text-sm font-medium text-gray-700">{category.name}</span>
                  </label>
                ))}
              </div>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Product Details</h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="brand">Brand</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-3 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C4FFF] focus:border-[#6C4FFF] ${errors.brand ? "border-red-500" : "border-gray-300"}`}
                    id="brand"
                    placeholder="Brand nomini kiriting"
                    value={formData.brand}
                    onChange={(e) => handleInputChange("brand", e.target.value)}
                  />
                  {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="grade">Grade</label>
                  <input 
                    type="text" 
                    className={`w-full px-4 py-3 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C4FFF] focus:border-[#6C4FFF] ${errors.grade ? "border-red-500" : "border-gray-300"}`}
                    id="grade"
                    placeholder="Grade nomini kiriting"
                    value={formData.grade}
                    onChange={(e) => handleInputChange("grade", e.target.value)}
                  />
                  {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="unit">Birlik</label>
                  <div className="relative">
                    <select 
                      className={`w-full px-4 py-3 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C4FFF] focus:border-[#6C4FFF] appearance-none pr-10 ${errors.unit ? "border-red-500" : "border-gray-300"}`}
                      id="unit"
                      value={formData.unit || ''}
                      onChange={(e) => handleInputChange("unit", e.target.value ? parseInt(e.target.value) : null)}
                      disabled={units.length <= 1} // Agar bitta unit bo'lsa disabled
                    >
                      <option value="">Kategoriya uchun mos birlik avtomatik tanlanadi</option>
                      {units.map((unit) => (
                        <option key={unit.id} value={unit.id}>{unit.name} ({unit.symbol})</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      expand_more
                    </span>
                  </div>
                  {units.length === 1 && (
                    <p className="text-green-600 text-sm mt-1">✓ Bu kategoriya uchun avtomatik birlik tanlandi</p>
                  )}
                  {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="factory">Zavod</label>
                  <div className="relative">
                    <select 
                      className={`w-full px-4 py-3 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C4FFF] focus:border-[#6C4FFF] appearance-none pr-10 ${errors.factory ? "border-red-500" : "border-gray-300"}`}
                      id="factory"
                      value={formData.factory}
                      onChange={(e) => handleInputChange("factory", parseInt(e.target.value))}
                    >
                      <option value="">Zavodni tanlang</option>
                      {factories.map((factory) => (
                        <option key={factory.id} value={factory.id}>{factory.name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      expand_more
                    </span>
                  </div>
                  {errors.factory && <p className="text-red-500 text-sm mt-1">{errors.factory}</p>}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Pricing & Logistics</h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="base_price">Asosiy narx</label>
                  <input 
                    className={`w-full px-4 py-3 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C4FFF] focus:border-[#6C4FFF] ${errors.base_price ? "border-red-500" : "border-gray-300"}`}
                    id="base_price"
                    type="number"
                    placeholder="Narxni kiriting"
                    value={formData.base_price}
                    onChange={(e) => handleInputChange("base_price", e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  {errors.base_price && <p className="text-red-500 text-sm mt-1">{errors.base_price}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="min_order_quantity">Minimal buyurtma miqdori</label>
                  <input 
                    className={`w-full px-4 py-3 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C4FFF] focus:border-[#6C4FFF] ${errors.min_order_quantity ? "border-red-500" : "border-gray-300"}`}
                    id="min_order_quantity"
                    type="number"
                    placeholder="Minimal miqdorni kiriting"
                    value={formData.min_order_quantity}
                    onChange={(e) => handleInputChange("min_order_quantity", e.target.value)}
                    min="1"
                  />
                  {errors.min_order_quantity && <p className="text-red-500 text-sm mt-1">{errors.min_order_quantity}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="delivery_locations">Yetkazib berish joylar</label>
                  <div className="relative">
                    <input 
                      className={`w-full px-4 py-3 pr-10 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C4FFF] focus:border-[#6C4FFF] ${errors.delivery_locations ? "border-red-500" : "border-gray-300"}`}
                      id="delivery_locations"
                      placeholder="Masalan: Toshkent, Samarqand, Buxoro"
                      value={formData.delivery_locations}
                      onChange={(e) => handleInputChange("delivery_locations", e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      location_on
                    </span>
                  </div>
                  {errors.delivery_locations && <p className="text-red-500 text-sm mt-1">{errors.delivery_locations}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="specifications">Texnik xususiyatlar <span className="text-gray-400 font-normal">(ixtiyoriy)</span></label>
                  <textarea 
                    className={`w-full px-4 py-3 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C4FFF] focus:border-[#6C4FFF] ${errors.specifications ? "border-red-500" : "border-gray-300"}`}
                    id="specifications"
                    placeholder="Mahsulotning texnik xususiyatlarini kiriting"
                    value={formData.specifications}
                    onChange={(e) => handleInputChange("specifications", e.target.value)}
                    rows={3}
                  />
                  {errors.specifications && <p className="text-red-500 text-sm mt-1">{errors.specifications}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="material">Material <span className="text-gray-400 font-normal">(ixtiyoriy)</span></label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C4FFF] focus:border-[#6C4FFF]"
                    id="material"
                    placeholder="Agar kerak bo'lsa material nomini kiriting"
                    value={formData.material}
                    onChange={(e) => handleInputChange("material", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="origin_country">Ishlab chiqarish davlati</label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6C4FFF] focus:border-[#6C4FFF]"
                    id="origin_country"
                    placeholder="Masalan: O'zbekiston"
                    value={formData.origin_country}
                    onChange={(e) => handleInputChange("origin_country", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 4: Uploads</h2>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="certificates">Sertifikat yuklash</label>
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="certificates-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="material-symbols-outlined text-gray-500 text-4xl">asset_analytics</span>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Sertifikat yuklash</span> uchun bosing
                        </p>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                        {formData.certificates.length > 0 && (
                          <p className="text-xs text-green-600 mt-1">{formData.certificates.length} fayl tanlandi</p>
                        )}
                      </div>
                      <input 
                        className="hidden"
                        id="certificates-upload"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        multiple
                        onChange={(e) => handleFileUpload("certificates", e.target.files)}
                      />
                    </label>
                  </div>
                  {errors.certificates && <p className="text-red-500 text-sm mt-1">{errors.certificates}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="photos">Mahsulot rasmlari</label>
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="photos-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="material-symbols-outlined text-gray-500 text-4xl">add_photo_alternate</span>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Rasm yuklash</span> uchun bosing
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                        {formData.photos.length > 0 && (
                          <p className="text-xs text-green-600 mt-1">{formData.photos.length} rasm tanlandi</p>
                        )}
                      </div>
                      <input 
                        className="hidden"
                        id="photos-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload("photos", e.target.files)}
                      />
                    </label>
                  </div>
                  {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white px-4 py-4 border-t border-gray-200 mt-8">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-5 bg-[#6C4FFF] text-white text-base font-bold leading-normal tracking-wide shadow-sm hover:bg-[#5A3FE6] focus:outline-none focus:ring-2 focus:ring-[#6C4FFF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saqlanmoqda...</span>
                  </div>
                ) : (
                  <span>Saqlash</span>
                )}
              </button>
            </div>
          </form>
          )}
        </main>
      </div>
      {/* Bottom Navigation */}
      <BottomNavigation />

    </div>
  );
};

export default SupplierAddProduct;