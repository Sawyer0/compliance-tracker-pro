// Global Layout Wrapper

export default function RootLayout({
    children,

}:{
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                {/* Layout UI */}
                {/* Place children where I want to render a page or nested layout */}
                <main>{children}</main>
            </body>
        </html>
    )
} 