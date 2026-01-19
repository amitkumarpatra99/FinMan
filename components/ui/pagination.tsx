import React from 'react'
import { Button } from './button'

interface PaginationProps {
    page: number
    totalPages: number
    onPageChange: (page: number) => void
}

const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
    return (
        <div className="flex w-full items-center justify-between gap-4 p-4">
            <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                Previous
            </Button>
            <div className="text-14 font-medium">
                Page {page} of {totalPages}
            </div>
            <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </Button>
        </div>
    )
}

export default Pagination
