
import { Link } from "react-router-dom";

function Landing() {
    
  
    return (
      <div className="main">

        <div className="mt-48 w-min">
          <h1 className=" relative text-[15rem] font-extrabold tracking-tight">Name.</h1>
          
            <Link to="/login"><p className="relative mr-14 inline-block drop-shadow-2xl 
            active:bg-slate-200  
            rounded-full p-3 w-1/4 text-xl 
            font-bold bg-slate-50 
            text-slate-400" >Login</p></Link>

          <Link to="/signup"><p className="relative inline-block drop-shadow-2xl 
            active:bg-slate-200  
            rounded-full p-3 w-1/4 text-xl 
            font-bold bg-slate-50 
            text-slate-400" >Sign Up</p></Link>
        
      </div>

      </div>
    )
}

export default Landing;