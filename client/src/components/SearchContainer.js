import {FormRow, FormRowSelect} from '.'
import Wrapper from '../assets/wrappers/SearchContainer.js';
import { useAppContext } from '../context/appContext.js';

const  SearchContainer = () => {

    const {
        isLoading, 
        search, 
        searchStatus, 
        searchType, 
        sort, 
        sortOptions, 
        handleChange, 
        clearFilters,
        jobTypeOptions,
        statusOptions} = useAppContext()
    
    const handleSearch = (e) => {
        if(isLoading) return
        handleChange({name:e.target.name, value:e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        clearFilters()
    }

    return (
       <Wrapper>
        <form className= 'form'>
            <h4>search form</h4>
            <div className="form-center">
                <FormRow
                    type='text'
                    name='search'
                    value={search}
                    handleChange={handleSearch}
                />
                <FormRowSelect 
                    labelText='status'
                    name='searchStatus'
                    value={searchStatus}
                    handleChange={handleSearch}
                    list={['all', ...statusOptions]}
                />
                <FormRowSelect 
                    labelText='job Type'
                    name='searchType'
                    value={searchType}
                    handleChange={handleSearch}
                    list={['all', ...jobTypeOptions]}
                />
                <FormRowSelect 
                    name='name'
                    value={sort}
                    handleChange={handleSearch}
                    list={sortOptions}
                />
                <button 
                    className='btn btn-block btn-danger'
                    disabled={isLoading}
                    onClick={handleSubmit}>
                    Clear filters
                </button>

            </div>
        </form>
       </Wrapper>

    );
}

export default SearchContainer;