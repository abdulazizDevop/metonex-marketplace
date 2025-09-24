import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SupplierAddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "metal",
    brand: "",
    unit: "",
    variants: "",
    price: "",
    factory: "",
    moq: "",
    location: "",
    certificate: null,
    productImages: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: "metal", label: "Metal" },
    { value: "concrete", label: "Concrete" },
    { value: "cement", label: "Cement" },
    { value: "paint", label: "Paint" }
  ];

  const brands = [
    { value: "brand1", label: "Brand 1" },
    { value: "brand2", label: "Brand 2" },
    { value: "brand3", label: "Brand 3" }
  ];

  const units = [
    { value: "kg", label: "Kilogram" },
    { value: "ton", label: "Ton" },
    { value: "piece", label: "Piece" },
    { value: "meter", label: "Meter" }
  ];

  const variants = [
    { value: "variant1", label: "Variant 1" },
    { value: "variant2", label: "Variant 2" },
    { value: "variant3", label: "Variant 3" }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleFileUpload = (field, files) => {
    if (field === "certificate") {
      setFormData(prev => ({
        ...prev,
        [field]: files[0] || null
      }));
    } else if (field === "productImages") {
      setFormData(prev => ({
        ...prev,
        [field]: Array.from(files)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.brand) newErrors.brand = "Brand is required";
    if (!formData.unit) newErrors.unit = "Unit is required";
    if (!formData.variants) newErrors.variants = "Variant is required";
    if (!formData.price || formData.price <= 0) newErrors.price = "Valid price is required";
    if (!formData.moq || formData.moq <= 0) newErrors.moq = "Valid MOQ is required";
    if (!formData.location) newErrors.location = "Delivery location is required";
    if (!formData.certificate) newErrors.certificate = "Certificate is required";
    if (formData.productImages.length === 0) newErrors.productImages = "At least one product image is required";

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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Product data:", formData);
      
      alert("Product added successfully!");
      navigate("/seller/products");
      
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
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
            <h1 className="flex-1 text-center text-xl font-semibold text-gray-900">Add Product</h1>
            <div className="w-6"></div>
          </div>
          <div className="h-px bg-gray-200"></div>
        </header>

        <main className="px-4 py-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Choose Category</h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <label 
                    key={category.value}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                      formData.category === category.value 
                        ? "border-blue-600 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input 
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={formData.category === category.value}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Product Details</h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="brand">Brand</label>
                  <div className="relative">
                    <select 
                      className={`w-full px-4 py-3 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10 ${errors.brand ? "border-red-500" : "border-gray-300"}`}
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => handleInputChange("brand", e.target.value)}
                    >
                      <option value="">Select Brand</option>
                      {brands.map((brand) => (
                        <option key={brand.value} value={brand.value}>{brand.label}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      expand_more
                    </span>
                  </div>
                  {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="unit">Unit of Measurement</label>
                  <div className="relative">
                    <select 
                      className={`w-full px-4 py-3 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10 ${errors.unit ? "border-red-500" : "border-gray-300"}`}
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => handleInputChange("unit", e.target.value)}
                    >
                      <option value="">Select Unit</option>
                      {units.map((unit) => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      expand_more
                    </span>
                  </div>
                  {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="variants">Variants/Subcategories</label>
                  <div className="relative">
                    <select 
                      className={`w-full px-4 py-3 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10 ${errors.variants ? "border-red-500" : "border-gray-300"}`}
                      id="variants"
                      value={formData.variants}
                      onChange={(e) => handleInputChange("variants", e.target.value)}
                    >
                      <option value="">Select Variant</option>
                      {variants.map((variant) => (
                        <option key={variant.value} value={variant.value}>{variant.label}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      expand_more
                    </span>
                  </div>
                  {errors.variants && <p className="text-red-500 text-sm mt-1">{errors.variants}</p>}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Pricing & Logistics</h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="price">Price</label>
                  <input 
                    className={`w-full px-4 py-3 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.price ? "border-red-500" : "border-gray-300"}`}
                    id="price"
                    type="number"
                    placeholder="Enter Price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="factory">
                    Factory <span className="text-gray-400 font-normal">(only for dealers)</span>
                  </label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    id="factory"
                    placeholder="Enter Factory"
                    value={formData.factory}
                    onChange={(e) => handleInputChange("factory", e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="moq">Minimum Order Quantity</label>
                  <input 
                    className={`w-full px-4 py-3 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.moq ? "border-red-500" : "border-gray-300"}`}
                    id="moq"
                    type="number"
                    placeholder="Enter Quantity"
                    value={formData.moq}
                    onChange={(e) => handleInputChange("moq", e.target.value)}
                    min="1"
                  />
                  {errors.moq && <p className="text-red-500 text-sm mt-1">{errors.moq}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="location">Delivery Location</label>
                  <div className="relative">
                    <input 
                      className={`w-full px-4 py-3 pr-10 border rounded-lg text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.location ? "border-red-500" : "border-gray-300"}`}
                      id="location"
                      placeholder="Enter Location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      location_on
                    </span>
                  </div>
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Step 4: Uploads</h2>
              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="certificate">Certificate Upload</label>
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="certificate-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="material-symbols-outlined text-gray-500 text-4xl">cloud_upload</span>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG (MAX. 5MB)</p>
                        {formData.certificate && (
                          <p className="text-xs text-green-600 mt-1"> {formData.certificate.name}</p>
                        )}
                      </div>
                      <input 
                        className="hidden"
                        id="certificate-upload"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload("certificate", e.target.files)}
                      />
                    </label>
                  </div>
                  {errors.certificate && <p className="text-red-500 text-sm mt-1">{errors.certificate}</p>}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700" htmlFor="product-images">Product Images</label>
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="product-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <span className="material-symbols-outlined text-gray-500 text-4xl">add_photo_alternate</span>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 800x400px)</p>
                        {formData.productImages.length > 0 && (
                          <p className="text-xs text-green-600 mt-1"> {formData.productImages.length} image(s) selected</p>
                        )}
                      </div>
                      <input 
                        className="hidden"
                        id="product-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileUpload("productImages", e.target.files)}
                      />
                    </label>
                  </div>
                  {errors.productImages && <p className="text-red-500 text-sm mt-1">{errors.productImages}</p>}
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>

      <div className="sticky bottom-0 bg-white px-4 py-4 border-t border-gray-200">
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-5 bg-blue-600 text-white text-base font-bold leading-normal tracking-wide shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
            <span>Save</span>
          )}
        </button>
      </div>

    </div>
  );
};

export default SupplierAddProduct;