import React, { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, FileWarning } from 'lucide-react';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface CVDisplayProps {
    user: {
        cvUrl?: string;
    };
}

const CVDisplay: React.FC<CVDisplayProps> = ({ user }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1);
    const [pdfError, setPdfError] = useState<string>('');

    useEffect(() => {
        setNumPages(0);
        setPageNumber(1);
        setPdfError('');
    }, [user.cvUrl]);

    useEffect(() => {
        return () => {
            // Clean up PDF.js worker on unmount
            if (pdfjs.GlobalWorkerOptions.workerSrc) {
                // Reset PDF.js state
                setNumPages(0);
                setPageNumber(1);
                setPdfError('');
            }
        };
    }, []);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPdfError('');
    };

    const onDocumentLoadError = () => {
        setPdfError('Failed to load PDF. Please check if the file is accessible.');
    };

    const goToPrevPage = () => {
        setPageNumber(prev => Math.max(prev - 1, 1));
    };

    const goToNextPage = () => {
        setPageNumber(prev => Math.min(prev + 1, numPages));
    };

    return (
        <div className="flex-1 flex flex-col justify-between gap-4 h-full -mt-16">
            <div className="flex-grow flex flex-col">
                {user.cvUrl ? (
                    <div className="flex flex-col h-full">
                        {/* PDF Controls */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 border-b rounded-t">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={goToPrevPage}
                                    disabled={pageNumber <= 1}
                                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <span className="text-sm font-medium">
                                    {numPages > 0 ? `${pageNumber} / ${numPages}` : 'Loading...'}
                                </span>
                                <button
                                    onClick={goToNextPage}
                                    disabled={pageNumber >= numPages}
                                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* PDF Viewer */}
                        <div className="flex-grow overflow-auto bg-gray-100 flex items-center justify-center">
                            {pdfError ? (
                                <div className="text-red-600 text-sm text-center p-4">
                                    {pdfError}
                                </div>
                            ) : (
                                <Document
                                    file={user.cvUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    onLoadError={onDocumentLoadError}
                                    loading={
                                        <div className="flex items-center justify-center p-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                                            <span className="ml-2 text-gray-600">Loading PDF...</span>
                                        </div>
                                    }
                                    error={
                                        <div className="text-red-600 text-sm text-center p-4">
                                            Failed to load PDF. Please check if the file is accessible.
                                        </div>
                                    }
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        scale={scale}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                        loading={
                                            <div className="flex items-center justify-center p-4">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600"></div>
                                            </div>
                                        }
                                        className="shadow-lg"
                                    />
                                </Document>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-18 sm:py-11 h-full">
                        <FileWarning className="h-20 w-20 text-gray-500" />
                        <p className="text-black text-md sm:text-xl">No CV uploaded yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CVDisplay;