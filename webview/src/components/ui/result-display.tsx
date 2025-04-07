export interface ResultDisplayProps {
    result: string | null;
    error: string | null;
}

export function ResultDisplay({ result, error }: ResultDisplayProps) {
    if (!result && !error) return null;
    
    return (
        <div className="mt-4">
            {result && (
                <div className="p-4 bg-green-100 text-green-800 rounded whitespace-pre-wrap">
                    <strong>Success:</strong> {result}
                </div>
            )}
            {error && (
                <div className="p-4 bg-red-100 text-red-800 rounded whitespace-pre-wrap">
                    <strong>Error:</strong> {error}
                </div>
            )}
        </div>
    );
}
