import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";

import api from "../../api/axios";

import JobCard from "./JobCard";

import {
fetchStart,
fetchSuccess,
fetchFail
} from "../../redux/slices/jobSlice";

const JobList=()=>{

const dispatch=useDispatch();

const {jobs,loading}=useSelector(state=>state.jobs);

useEffect(()=>{

loadJobs();

},[]);

const loadJobs=async()=>{

try{

dispatch(fetchStart());

const res=await api.get("/jobs");

dispatch(fetchSuccess(res.data.jobs));

}catch(err){

dispatch(fetchFail(err.message));

}

}

if(loading){

return <h2>Yükleniyor...</h2>

}

return(

<div className="grid lg:grid-cols-3 gap-6">

{

jobs.map(job=>(

<JobCard
key={job._id}
job={job}
/>

))

}

</div>

)

}

export default JobList;