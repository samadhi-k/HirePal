import main from "../assets/images/main.svg";
import {Logo} from "../components"
import Wrapper from "../assets/wrappers/LandingPage";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className='info'>
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit natus sequi, quas necessitatibus deleniti eum maxime labore 
            neque exercitationem! Maiores, voluptates necessitatibus! Praesentium, sequi! Repudiandae animi excepturi quod quaerat blanditiis!
          </p>
          <Link to='/register' className='btn btn-hero'>Login/Register</Link>
        </div>
        <img src={main} alt='job hunt' className='img main-img' />
      </div>
    </Wrapper>
  )
}

export default Landing;


