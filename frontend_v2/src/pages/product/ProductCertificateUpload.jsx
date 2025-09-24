import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const ProductCertificateUpload = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  
  const [certificates, setCertificates] = useState([
    {
      id: 1,
      name: 'Certificate_ISO_9001.pdf',
      size: '4.2MB',
      progress: 25,
      status: 'uploading'
    },
    {
      id: 2,
      name: 'Safety_Compliance.pdf',
      size: '1.8MB',
      progress: 50,
      status: 'uploading'
    }
  ])

  const [images, setImages] = useState([
    {
      id: 1,
      name: 'concrete_mixer_front.jpg',
      size: '3.1MB',
      progress: 75,
      status: 'uploading',
      url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=100&h=100&fit=crop&crop=center'
    },
    {
      id: 2,
      name: 'rebar_detail.png',
      size: '2.5MB',
      progress: 100,
      status: 'completed',
      url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=100&h=100&fit=crop&crop=center'
    }
  ])

  const handleClose = () => {
    navigate('/seller/add-product')
  }

  const handleFileUpload = (type) => {
    if (type === 'certificate') {
      fileInputRef.current?.click()
    } else {
      imageInputRef.current?.click()
    }
  }

  const handleFileChange = (event, type) => {
    const files = Array.from(event.target.files)
    files.forEach(file => {
      const newFile = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + 'MB',
        progress: 0,
        status: 'uploading',
        url: type === 'image' ? URL.createObjectURL(file) : null
      }

      if (type === 'certificate') {
        setCertificates(prev => [...prev, newFile])
      } else {
        setImages(prev => [...prev, newFile])
      }

      // Simulate upload progress
      simulateUpload(newFile.id, type)
    })
  }

  const simulateUpload = (fileId, type) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        
        if (type === 'certificate') {
          setCertificates(prev => prev.map(file => 
            file.id === fileId ? { ...file, progress: 100, status: 'completed' } : file
          ))
        } else {
          setImages(prev => prev.map(file => 
            file.id === fileId ? { ...file, progress: 100, status: 'completed' } : file
          ))
        }
      } else {
        if (type === 'certificate') {
          setCertificates(prev => prev.map(file => 
            file.id === fileId ? { ...file, progress: Math.round(progress) } : file
          ))
        } else {
          setImages(prev => prev.map(file => 
            file.id === fileId ? { ...file, progress: Math.round(progress) } : file
          ))
        }
      }
    }, 200)
  }

  const removeFile = (fileId, type) => {
    if (type === 'certificate') {
      setCertificates(prev => prev.filter(file => file.id !== fileId))
    } else {
      setImages(prev => prev.filter(file => file.id !== fileId))
    }
  }

  const handleBack = () => {
    navigate('/seller/add-product')
  }

  const handleSaveAndContinue = () => {
    navigate('/seller/add-product')
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col justify-between bg-gray-50 overflow-x-hidden">
      <div className="bg-white">
        {/* Header */}
        <div className="flex items-center p-4 pb-2 justify-between border-b border-gray-200">
          <button 
            onClick={handleClose}
            className="text-gray-600 flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          <h2 className="text-gray-900 text-lg font-semibold leading-tight tracking-tight flex-1 text-center pr-8">
            Add Product
          </h2>
        </div>

        <div className="p-4">
          {/* Certificates Section */}
          <div className="mb-6">
            <h3 className="text-gray-900 text-base font-semibold leading-tight tracking-tight mb-1">
              Certificates
            </h3>
            <p className="text-gray-500 text-sm font-normal leading-normal mb-3">
              Upload any relevant certificates for your product. This helps build trust with potential buyers.
            </p>
            
            <div 
              onClick={() => handleFileUpload('certificate')}
              className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 py-6 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-500">upload</span>
              <span>
                Drag and drop files here or{' '}
                <span className="text-[#1173d4]">click to upload</span>
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => handleFileChange(e, 'certificate')}
            />
          </div>

          {/* Certificate Files List */}
          <div className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                  <span className="material-symbols-outlined text-blue-600">description</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-800 text-sm font-medium">{cert.name}</p>
                    <p className="text-gray-500 text-xs">{cert.size}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-gray-200">
                      <div 
                        className={`h-1.5 rounded-full ${
                          cert.status === 'completed' ? 'bg-green-500' : 'bg-[#1173d4]'
                        }`}
                        style={{ width: `${cert.progress}%` }}
                      ></div>
                    </div>
                    {cert.status === 'completed' ? (
                      <span className="material-symbols-outlined text-base text-green-500">check_circle</span>
                    ) : (
                      <p className="text-gray-500 text-xs">{cert.progress}%</p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(cert.id, 'certificate')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-xl">
                    {cert.status === 'completed' ? 'delete' : 'cancel'}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          {/* Product Images Section */}
          <div className="mb-6">
            <h3 className="text-gray-900 text-base font-semibold leading-tight tracking-tight mb-1">
              Product Images
            </h3>
            <p className="text-gray-500 text-sm font-normal leading-normal mb-3">
              Showcase your product with high-quality images. Multiple angles and close-ups are recommended.
            </p>
            
            <div 
              onClick={() => handleFileUpload('image')}
              className="flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 py-6 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-500">add_photo_alternate</span>
              <span>
                Drag and drop files here or{' '}
                <span className="text-[#1173d4]">click to upload</span>
              </span>
            </div>

            <input
              ref={imageInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, 'image')}
            />
          </div>

          {/* Image Files List */}
          <div className="space-y-4">
            {images.map((image) => (
              <div key={image.id} className="flex items-center gap-3">
                <img 
                  className="h-10 w-10 rounded-lg object-cover" 
                  src={image.url} 
                  alt={image.name}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-800 text-sm font-medium">{image.name}</p>
                    <p className="text-gray-500 text-xs">{image.size}</p>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-gray-200">
                      <div 
                        className={`h-1.5 rounded-full ${
                          image.status === 'completed' ? 'bg-green-500' : 'bg-[#1173d4]'
                        }`}
                        style={{ width: `${image.progress}%` }}
                      ></div>
                    </div>
                    {image.status === 'completed' ? (
                      <span className="material-symbols-outlined text-base text-green-500">check_circle</span>
                    ) : (
                      <p className="text-gray-500 text-xs">{image.progress}%</p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(image.id, 'image')}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="material-symbols-outlined text-xl">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="flex gap-3 px-4 py-3">
          <button 
            onClick={handleBack}
            className="flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-gray-200 text-gray-800 font-bold text-base hover:bg-gray-300 transition-colors"
          >
            <span className="truncate">Back</span>
          </button>
          <button 
            onClick={handleSaveAndContinue}
            className="flex-1 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#1173d4] text-white font-bold text-base hover:bg-[#0f5fb8] transition-colors"
          >
            <span className="truncate">Save & Continue</span>
          </button>
        </div>
        <div className="h-5 bg-white"></div>
      </div>
    </div>
  )
}

export default ProductCertificateUpload
