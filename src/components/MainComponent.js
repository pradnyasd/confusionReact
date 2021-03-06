import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import DishDetail from './DishdetailComponent';
import Header from './HeaderComponent';
import Home from './HomeComponent';
import About from './AboutComponent';
import Menu from './MenuComponent';
import Contact from './ContactComponent';
import Footer from './FooterComponent';
import { connect } from 'react-redux';
import { postComment, fetchDishes, fetchComments, fetchPromos, fetchLeaders, postFeedback } from '../redux/ActionCreators';
import { actions } from 'react-redux-form';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const mapStateToProps = (state) => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}

const mapDispatchToProps = (dispatch) => ({
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
  fetchDishes: () => { dispatch(fetchDishes()) },
  resetFeedbackForm: () => { dispatch(actions.reset('feedback')) },
  fetchComments: () => { dispatch(fetchComments()) },
  fetchPromos: () => { dispatch(fetchPromos()) },
  fetchLeaders: () => { dispatch(fetchLeaders()) },
  // postFeedback: () => (firstname, lastname, telnum, email, agree, contactType, message) => {
  //   dispatch(postFeedback(firstname, lastname, telnum, email, agree, contactType, message));
  // }
  postFeedback: (firstname,lastname,telnum,email,agree,contactType,message) =>
    dispatch(
      postFeedback(firstname,lastname,telnum,email,agree,contactType,message)
    )
});

class Main extends Component{

  // constructor(props){
  //   super(props);
  // };

  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }

  render(){

    const HomePage = () => {
      return (
        <Home dish={ this.props.dishes.dishes.filter((dish) => dish.featured)[0] }
          dishesLoading={ this.props.dishes.isLoading }
          dishesErrMsg={ this.props.dishes.errMsg }
          promotion={ this.props.promotions.promotions.filter((promo) => promo.featured)[0] }
          promosLoading={ this.props.promotions.isLoading }
          promosErrMsg={ this.props.promotions.errMsg }
          leader={ this.props.leaders.leaders.filter((leader) => leader.featured)[0] }
          leadersLoading={ this.props.leaders.isLoading }
          leadersErrMsg={ this.props.leaders.errMsg }
        />
      );
    };

    const AboutPage = () => {
      return (
        <About
          leaders={ this.props.leaders.leaders }
          leadersLoading={ this.props.leaders.isLoading }
          leadersErrMsg={ this.props.leaders.errMsg }
        />
      );
    };

    const DishWithId = ({ match }) => {
      return (
        <DishDetail
          dish={ this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0] }
          isLoading={ this.props.dishes.isLoading }
          errMsg={ this.props.dishes.errMsg }
          comments = { this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10)) }
          errMsg={ this.props.comments.errMsg }
          postComment = { this.props.postComment }
         />
      )
    }

    const ContactPage = () => {
      return (
        <Contact
          resetFeedbackForm={this.props.resetFeedbackForm}
          postFeedback={this.props.postFeedback}
        />
      )
    }

    return (
      <div>
        <Header />
        <TransitionGroup>
          <CSSTransition key={ this.props.location.key } classNames="page" timeout={300}>
            <Switch>
              <Route path="/home" component={ HomePage } />
              <Route exact path="/menu" component={ () => <Menu dishes={ this.props.dishes } /> } />
              <Route path="/menu/:dishId" component={ DishWithId } />
              <Route exact path="/aboutus" component={ AboutPage } />
              <Route exact path="/contactus" component={ ContactPage } />
              <Redirect to="/home" />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));
