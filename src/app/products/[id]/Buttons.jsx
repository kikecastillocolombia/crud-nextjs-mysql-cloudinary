"use client"
import axios from 'axios'
import { useRouter } from 'next/navigation'

function Buttons({ productId }) {

    const router = useRouter()
    return (
        <div className='flex gap-x-2 justify-end'>
            <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                onClick={async () => {
                    if (confirm('sure you want to delete this product? ')) {
                        const res = await axios.delete('/api/products/' + productId)
                        if (res.status === 204) {
                            router.push('/products')
                            router.refresh()
                        }
                    }
                }}
            >delete</button>
            <button className='bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                onClick={() => router.push('/products/edit/' + productId)}>edit</button>
        </div>
    )
}

export default Buttons
