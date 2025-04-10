import { NextRequest, NextResponse } from 'next/server';

const CPANEL_API_URL = 'https://diplomatcorner.net:2083';
const CPANEL_USERNAME = 'diplomvv';
const CPANEL_API_TOKEN = '2JL5W3RUMNY0KOX451GL2PPY4L8RX9RS';
const PUBLIC_DOMAIN = 'https://diplomatcorner.net';

// Define the cPanel API response structure
interface CpanelResponse {
  status: number;
  errors?: string[] | null;
  data?: {
    succeeded: number;
    failed: number;
    warned: number;
    uploads: { size: number; warnings: string[]; file: string; reason: string; status: number }[];
  };
  warnings?: string[] | null;
  messages?: string[] | null;
  metadata?: Record<string, any>;
}

// Custom response type for the API
interface UploadResponse {
  success: boolean;
  publicUrl?: string;
  error?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'No file uploaded or invalid format' }, { status: 400 });
    }

    const apiFormData = new FormData();
    apiFormData.append('dir', '/public_html/public_images/');
    apiFormData.append('file-1', file, file.name);

    const authHeader = `cpanel ${CPANEL_USERNAME}:${CPANEL_API_TOKEN.trim()}`;
    console.log('Request URL:', `${CPANEL_API_URL}/execute/Fileman/upload_files`);
    console.log('Request Headers:', { Authorization: authHeader });
    console.log('Request Body:', [...apiFormData.entries()]);

    const response = await fetch(`${CPANEL_API_URL}/execute/Fileman/upload_files`, {
      method: 'POST',
      headers: { Authorization: authHeader },
      body: apiFormData,
    });

    const responseText = await response.text();
    console.log('Raw Response:', responseText);
    console.log('Response Status:', response.status);

    if (responseText.includes('<html')) {
      return NextResponse.json({ success: false, error: 'Authentication issue' }, { status: 401 });
    }

    const data: CpanelResponse = JSON.parse(responseText);
    if (data.status === 0) {
      return NextResponse.json(
        { success: false, error: data.errors?.join(', ') || 'Upload failed' },
        { status: 400 }
      );
    }

    // Construct the public URL from the uploaded file path
    const uploadedFile = data.data?.uploads[0];
    if (!uploadedFile || !uploadedFile.file) {
      return NextResponse.json(
        { success: false, error: 'No uploaded file details returned' },
        { status: 500 }
      );
    }

    // The full path is /public_html/public_images/filename
    const publicUrl = `${PUBLIC_DOMAIN}/public_images/${uploadedFile.file}`;
    return NextResponse.json({ success: true, publicUrl });
  } catch (error) {
    console.error('Image upload failed:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload image' }, { status: 500 });
  }
}