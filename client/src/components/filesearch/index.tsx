import * as React from "react"

import { FileCard } from "./file"
import { SearchResult } from "api"
import { SearchIcon } from "@chakra-ui/icons"
import { useForm } from "react-hook-form"
import { Pagination } from "components/pagination"

import { 
    Box, 
    Flex, 
    Heading, 
    Icon, 
    Input, 
    InputGroup, 
    InputLeftElement, 
    Text 
} from "@chakra-ui/react"

export const FileSearch: React.FC<{
    onSearch: (page: number, query?: string) => Promise<SearchResult>
    onDelete: (fileId: string) => Promise<void>
    onFileDetails: (fileId: string) => void
}> = ({ onSearch, onDelete, onFileDetails }) => {
    const [searchResult, setSearchResult] = React.useState<SearchResult | null>(null)
    const [queryString, setQueryString] = React.useState<string>(null)
    const [currentPage, setCurrentPage] = React.useState(1)

    React.useEffect(() => {
        onSearch(1, null)
            .then(setSearchResult)
            .catch(() => setSearchResult(null))
    }, [])

    const searchCallback = React.useCallback(form => {
        setQueryString(form.query)

        // Search callback should go back to page 1
        onSearch(1, form.query)
            .then(setSearchResult)
            .catch(() => setSearchResult(null))
    }, [])

    React.useEffect(() => {
        onSearch(currentPage, queryString)
            .then(setSearchResult)
            .catch(() => setSearchResult(null))
    }, [currentPage])

    const deleteFile = React.useCallback(fileId => {
        onDelete(fileId)
            .then(() => onSearch(1, queryString))
            .then(setSearchResult)
            .catch(() => setSearchResult(null))
    }, [])

    const { register, handleSubmit } = useForm()

    return <Box>
        <form onSubmit={handleSubmit(searchCallback)}>
            <InputGroup>
                <InputLeftElement color="gray.500" children={<Icon as={SearchIcon}/>} />
                <Input variant="filled" {...register("query")} placeholder="Search for files" />
            </InputGroup>
        </form>

        { searchResult === null ? <Box color="gray.500" textAlign="center">
            <Heading size="xl" mt={6} mb={2}>:(</Heading>
            <Heading as="h2" size="lg">No files found</Heading>
            <Text>There were no files matched your query</Text>
        </Box> : <Flex justifyContent="center" gap="20px" wrap="wrap" mt={6}>
            { searchResult.files.map(file => <FileCard 
                    key={file.id} 
                    file={file} 
                    onDetails={file => onFileDetails(file.id)} 
                    onDelete={file => deleteFile(file.id)}/>) }
        </Flex> }

        { searchResult?.pages > 1 ? 
            <Flex justifyContent="center" mt={5} mb={5}>
                <Pagination 
                    pages={searchResult.pages} 
                    currentPage={currentPage}
                    range={3}
                    onPageSelect={setCurrentPage}/>
            </Flex> : <></> }
    </Box>
}