import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootState } from '../../store/reducers/RootReducer';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import PageHeader from '../pageheader/Pageheader';
import { Avatar } from '@mui/material';
import { Dispatch } from 'redux';

interface IProfileProps extends RouteComponentProps {
  user: SharePointUser;
}

interface IProfileState {

}
interface DispatchProps {
}
interface StateProps {
}

class Profile extends React.Component<IProfileProps, IProfileState> {
  //   constructor(props) {
  //     super(props);
  //     this.state = {
  //       name: '',
  //       age: '',
  //       email: '',
  //     };
  //  }
  handleGoBack = (): void => {
    const { history } = this.props;
    history.goBack();
  };

  render(): JSX.Element {
    const { user } = this.props;
    const FirstName = user.Title.split(' ')[0];
    const FullNameInitials= user.Title.split(' ').map((name: string) => name[0]).join('');
    return (
      <div>
        <ArrowBackOutlinedIcon onClick={this.handleGoBack} sx={{ color: "rgb(139, 161, 183)" }} />
        <PageHeader
          title={`Welcome ${FirstName}!`}
          subTitle={`${user.Email}`}
          icon={
            <Avatar sx={{ width: '58px', height: '58px' }}>
              {FullNameInitials}
            </Avatar>
          }
        />

      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
    
});


const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Profile)
);

