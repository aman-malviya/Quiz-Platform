import React from 'react'
import LeaderBoard from './LeaderBoard'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import Quiz from './Quiz'
import Register from './Register'
import NotFound from './NotFound'
import Score from './Score'
import Login from './Login'
import Home from './Home'
import { AuthProvider } from '../Contexts/AuthContext'
import PrivateRoute from './PrivateRoute'
import EditQuiz from './EditQuiz'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'

export default function App(){
    return(
    <AuthProvider>
            <Router>
                <Switch>
                    <Route path='/register'><Register /></Route>
                    <Route path='/login' component={Login} />
                    <Route path='/forgot-password' component={ForgotPassword} />
                    <Route path='/auth' component={ResetPassword} />
                    <PrivateRoute path="/leader-board" component={LeaderBoard} />
                    <PrivateRoute path='/quiz/:id' component={Quiz} />
                    <PrivateRoute path='/score/:id' component={Score} />
                    <PrivateRoute path="/edit/:id" component={EditQuiz} />
                    <PrivateRoute path="/" component={Home} />
                    <Route><NotFound /></Route>
                </Switch>
            </Router>
    </AuthProvider>
    )
}
