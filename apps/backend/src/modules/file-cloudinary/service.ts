import { v2 as cloudinary } from 'cloudinary'

import { FileTypes } from '@medusajs/framework/types'
import { AbstractFileProviderService } from '@medusajs/framework/utils'

type CloudinaryOptions = {
  cloud_name: string
  api_key: string
  api_secret: string
  secure?: boolean
}

export class CloudinaryFileService extends AbstractFileProviderService {
  static identifier = 'cloudinary'

  constructor(_, options: CloudinaryOptions) {
    super()

    cloudinary.config({
      cloud_name: options.cloud_name,
      api_key: options.api_key,
      api_secret: options.api_secret,
      secure: options.secure ?? true
    })
  }

  async upload(
    file: FileTypes.ProviderUploadFileDTO
  ): Promise<FileTypes.ProviderFileResultDTO> {
    console.log('Starting file upload:', {
      filename: file.filename,
      contentLength: file.content?.length,
      access: file.access,
      contentType: typeof file.content,
      isBuffer: Buffer.isBuffer(file.content)
    })

    try {
      // Validate input
      if (!file.content) {
        throw new Error('File content is missing')
      }

      if (!file.filename) {
        throw new Error('File filename is missing')
      }

      let fileBuffer: Buffer
      if (Buffer.isBuffer(file.content)) {
        fileBuffer = file.content
      } else if (
        ArrayBuffer.isView(file.content) &&
        file.content.constructor.name === 'Uint8Array'
      ) {
        fileBuffer = Buffer.from(file.content)
      } else if (typeof file.content === 'string') {
        try {
          fileBuffer = Buffer.from(file.content, 'base64')
          if (
            fileBuffer.length === 0 ||
            (file.content.length > 0 &&
              fileBuffer.length < file.content.length / 2)
          ) {
            fileBuffer = Buffer.from(file.content, 'binary')
          }
        } catch (error: any) {
          console.error('Base64 decode error:', error.message)
          fileBuffer = Buffer.from(file.content, 'binary')
        }
      } else {
        console.error('Invalid file content type:', typeof file.content)
        throw new Error('File content must be a Buffer, Uint8Array, or string')
      }

      console.log('Buffer validation:', {
        isBuffer: Buffer.isBuffer(fileBuffer),
        length: fileBuffer.length,
        firstBytes: Buffer.from(fileBuffer).subarray(0, 10).toString('hex')
      })

      // Determine if the file is an image
      const isImage = /\.(jpg|jpeg|png|gif|bmp|webp|tiff)$/i.test(file.filename)
      console.log('File type detection:', { filename: file.filename, isImage })

      const uploadOptions: any = {
        resource_type: 'auto',
        folder: file.access === 'private' ? 'private' : 'public',
        use_filename: true,
        unique_filename: true
      }

      // Add quality optimization for images only
      if (isImage) {
        uploadOptions.quality = 'auto'
      }

      console.log('Upload options:', uploadOptions)

      // Convert buffer to stream and upload
      const uploadResult: any = await new Promise((resolve, reject) => {
        console.log('Creating upload stream...')

        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', {
                message: error.message,
                http_code: error.http_code,
                error: error
              })
              reject(error)
            } else if (!result) {
              console.error('Cloudinary upload returned null result')
              reject(new Error('Upload returned null result'))
            } else if (!result.secure_url) {
              console.error('Cloudinary upload result missing URL:', {
                public_id: result.public_id,
                result: result
              })
              reject(new Error('Upload result missing secure_url'))
            } else {
              console.log('Cloudinary upload successful:', {
                url: result.secure_url,
                public_id: result.public_id,
                format: result.format,
                resource_type: result.resource_type
              })
              resolve(result)
            }
          }
        )

        stream.on('error', (streamError) => {
          console.error('Stream error:', streamError)
          reject(streamError)
        })

        console.log('Writing file content to stream...')
        stream.end(fileBuffer)
      })

      // Final validation
      if (!uploadResult || !uploadResult.secure_url) {
        throw new Error('Upload completed but no valid URL was returned')
      }

      const result = {
        url: uploadResult.secure_url,
        key: uploadResult.public_id
      }

      console.log('Upload completed successfully:', result)
      return result
    } catch (error) {
      console.error('File upload failed:', {
        message: error.message,
        stack: error.stack,
        filename: file.filename
      })
      throw new Error(`Failed to upload file to Cloudinary: ${error.message}`)
    }
  }

  async delete(file: FileTypes.ProviderDeleteFileDTO): Promise<void> {
    try {
      await cloudinary.uploader.destroy(file.fileKey)
    } catch (error) {
      throw new Error(`Failed to delete file from Cloudinary: ${error.message}`)
    }
  }

  async getPresignedDownloadUrl(
    file: FileTypes.ProviderGetFileDTO
  ): Promise<string> {
    // For Cloudinary, we can return the direct URL since it handles access control
    return cloudinary.url(file.fileKey, {
      secure: true,
      sign_url: true,
      type: 'authenticated'
    })
  }
}
