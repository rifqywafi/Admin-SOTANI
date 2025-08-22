export default function Dashboard(){
    return(
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-ternary/10">
            <div className="w-full max-w-md p-8 bg-white shadow-2xl rounded-2xl">
                <h2 className="text-3xl font-bold text-center text-primary mb-6">
                    Dashboard
                </h2>
                <p className="text-center text-gray-700">Selamat datang di dashboard admin!</p>
            </div>
        </div>
    )
}