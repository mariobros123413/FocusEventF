import { Link } from 'react-router-dom';
import { styled } from '@mui/material';

const LinkStyled = styled(Link)(() => ({
  height: '70px',
  width: '180px',
  overflow: 'hidden',
  display: 'block',
}));

const Logo = () => {
  return (
    <LinkStyled to="/">
      <img
        className="headerImg"
        src="https://scontent.fvvi1-1.fna.fbcdn.net/v/t1.15752-9/396709202_1049906952677975_1223164373365173731_n.png?_nc_cat=108&ccb=1-7&_nc_sid=8cd0a2&_nc_ohc=4E4p8O-vFEEAX-zlRF_&_nc_ht=scontent.fvvi1-1.fna&oh=03_AdR6jr8D9BQWPcnSgeBuy5KL1sWk1nRqmV0Y4s12dY-5Kw&oe=656CEE8A"
        alt=""
        height={90}
      />    </LinkStyled>
  )
};

export default Logo;
