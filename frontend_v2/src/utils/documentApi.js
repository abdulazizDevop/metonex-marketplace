/**
 * Document API Functions
 * Order-specific document upload va boshqaruv uchun API calls
 */

import { api, endpoints } from './api.js'

/**
 * Order documents uchun API functions
 */
export const documentApi = {
  // Order documents ni olish
  async getOrderDocuments(orderId) {
    try {
      const response = await api.get(endpoints.documents.orderDocuments(orderId))
      return response
    } catch (error) {
      console.error('Error fetching order documents:', error)
      throw error
    }
  },

  // Document yuklash (FormData bilan)
  async uploadDocument(documentData, file) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', documentData.title)
      formData.append('document_type', documentData.type)
      
      if (documentData.orderId) {
        formData.append('order', documentData.orderId)
      }
      
      if (documentData.description) {
        formData.append('description', documentData.description)
      }

      const response = await api.upload(endpoints.documents.create, formData)
      return response
    } catch (error) {
      console.error('Error uploading document:', error)
      throw error
    }
  },

  // Document download qilish
  async downloadDocument(documentId) {
    try {
      const response = await fetch(`${import.meta.env?.VITE_API_URL || 'http://localhost:8000/api'}${endpoints.documents.download(documentId)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Download failed')
      }

      // File stream olish
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      // Content-Disposition header dan filename olish
      const contentDisposition = response.headers.get('content-disposition')
      let filename = 'document'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/)
        if (filenameMatch) {
          filename = filenameMatch[1]
        }
      }

      // Download trigeer qilish
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      return { success: true, filename }
    } catch (error) {
      console.error('Error downloading document:', error)
      throw error
    }
  },

  // Document o'chirish
  async deleteDocument(documentId) {
    try {
      await api.delete(endpoints.documents.delete(documentId))
      return { success: true }
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  },

  // Foydalanuvchining hujjatlari
  async getMyDocuments(filters = {}) {
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.type) {
        queryParams.append('type', filters.type)
      }
      
      const endpoint = `${endpoints.documents.myDocuments}${queryParams.toString() ? '?' + queryParams.toString() : ''}`
      const response = await api.get(endpoint)
      return response
    } catch (error) {
      console.error('Error fetching my documents:', error)
      throw error
    }
  },

  // Document tasdiqlash (Admin uchun)
  async verifyDocument(documentId, action, reason = '') {
    try {
      const response = await api.post(endpoints.documents.verify(documentId), {
        action, // 'verify' yoki 'reject'
        reason
      })
      return response
    } catch (error) {
      console.error('Error verifying document:', error)
      throw error
    }
  },

  // Document ulashish
  async shareDocument(documentId, shareData) {
    try {
      const response = await api.post(endpoints.documents.share(documentId), shareData)
      return response
    } catch (error) {
      console.error('Error sharing document:', error)
      throw error
    }
  },

  // Document qidirish
  async searchDocuments(searchParams) {
    try {
      const response = await api.post(endpoints.documents.search, searchParams)
      return response
    } catch (error) {
      console.error('Error searching documents:', error)
      throw error
    }
  },

  // Men bilan ulashilgan hujjatlar
  async getSharedWithMe() {
    try {
      const response = await api.get(endpoints.documents.sharedWithMe)
      return response
    } catch (error) {
      console.error('Error fetching shared documents:', error)
      throw error
    }
  },

  // Men ulashgan hujjatlar
  async getSharedByMe() {
    try {
      const response = await api.get(endpoints.documents.sharedByMe)
      return response
    } catch (error) {
      console.error('Error fetching documents shared by me:', error)
      throw error
    }
  }
}

/**
 * Document validation utilities
 */
export const documentValidation = {
  // File size validation (10MB limit)
  validateFileSize(file) {
    const maxSize = 10 * 1024 * 1024 // 10MB
    return file.size <= maxSize
  },

  // File type validation
  validateFileType(file) {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    return allowedTypes.includes(file.type)
  },

  // File extension validation
  validateFileExtension(filename) {
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx']
    const extension = filename.split('.').pop().toLowerCase()
    return allowedExtensions.includes(extension)
  },

  // Complete file validation
  validateFile(file) {
    const errors = []

    if (!this.validateFileSize(file)) {
      errors.push('Fayl hajmi 10MB dan oshmasligi kerak')
    }

    if (!this.validateFileType(file)) {
      errors.push('Fayl turi qo\'llab-quvvatlanmaydi')
    }

    if (!this.validateFileExtension(file.name)) {
      errors.push('Fayl kengaytmasi ruxsat etilmagan')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

/**
 * Document type utilities
 */
export const documentTypes = {
  CONTRACT: 'contract',
  INVOICE: 'invoice',
  TTN: 'ttn',
  COMPANY_LICENSE: 'company_license',
  TAX_CERTIFICATE: 'tax_certificate',
  CERTIFICATE: 'certificate',
  OTHER: 'other',

  // Display labels
  labels: {
    contract: 'Shartnoma',
    invoice: 'Hisob-faktura',
    ttn: 'TTN (Transport hujjati)',
    company_license: 'Kompaniya litsenziyasi',
    tax_certificate: 'Soliq guvohnomasi',
    certificate: 'Sertifikat',
    other: 'Boshqa'
  },

  // Get label by type
  getLabel(type) {
    return this.labels[type] || type
  },

  // Get icon by type
  getIcon(type) {
    const icons = {
      contract: 'description',
      invoice: 'receipt',
      ttn: 'local_shipping',
      company_license: 'business',
      tax_certificate: 'verified',
      certificate: 'shield',
      other: 'folder'
    }
    return icons[type] || 'description'
  }
}

export default documentApi
