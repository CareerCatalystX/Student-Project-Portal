import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }
        
        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw', // For PDFs
                    folder: 'student-cvs', // Organize uploads
                    public_id: `cv_${Date.now()}`, // Unique filename
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });
        
        return NextResponse.json({ 
            url: (result as any).secure_url,
            message: 'File uploaded successfully' 
        });
        
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json({ 
            error: 'Upload failed' 
        }, { status: 500 });
    }
}