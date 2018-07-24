import React, { Component } from 'react'
import { ScrollView, View, Text, Image } from 'react-native'
import { Button } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons';

import Error from '../Extra/ErrorBoundary'
import { myIp } from '../Extra/MyIp'

import { userDetails, userPosts } from '../Fetch/Requests'

import Auth from '../Auth/Auth';
const auth = new Auth()

import { profile } from '../../assets/css/profile'

var images = [
    require('../../assets/images/index.jpeg'),
    require('../../assets/images/index.jpeg'),
    require('../../assets/images/index.jpeg'),
    require('../../assets/images/index.jpeg')
]

export default class Profile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            index:0,
            owner: false,
            user: {
                id: '',
                username: '',
                picture: {
                    url:''
                },
                created_at:'',
            },
            posts: []
        }
    }
    
    componentWillMount = () => {
        let id;
        console.log(this.props)
        if (this.props.navigation.state.params) {
            console.log('navigation props')
            id = this.props.navigation.state.params
            alert('y2es')
            userDetails(id, response => {
                if (response !== false) {
                    this.setState({user:response.user, posts:response.posts, owner: false}) 
                    alert(this.state.user)
                } else {
                    alert('Error retrieving the profile')
                }
            })
        } else {
            console.log('clicked profile')
            auth.getItem('session').then(data => {
                id = data
                userDetails(id, response => {
                    if (response !== false) {
                        this.setState({user:response.user, posts:response.posts, owner: true}) 
                        alert(JSON.stringify(this.state))
                    } else {
                        alert('Error retrieving the profile')
                    }
                })
            })
        }
    }

    renderSection = () => {
        if (this.state.index == 0) {
            return( <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                        {this.sectionOne()}
                    </View>)
        } else if (this.state.index == 1) {
            return ( <View>

                    </View>
            )
        }
    }

    sectionOne = () => {
        return  images.map((image,index) => {
            return ( 
                    <View key={index} 
                    style={[profile.images,
                        index % 3 !==0 ? {paddingLeft:2} : {paddingLeft:0}    
                    ]}>
                    
                    <Image style={profile.imageIndex}
                        source={image}
                    />
                </View>
            )
        })
    }

    segmentClick = (index) => {
        this.setState({index:index})
    }

    render() {
        const { username, created_at, picture} = this.state.user;
 
        return (
        <Error>   
            <ScrollView style={profile.container}>
                <View style={profile.profileTab}>
                    <View style={profile.data}>
                        <Image source={{uri: `${myIp}${picture}`}}
                                style={profile.image}/>
                    </View>
                    <View style={{flex:3}}>
                        <View style={profile.dashboard}>
                           <View style={{alignItems:'center'}}>
                                <Text>20</Text>
                                <Text style={{fontSize:10, color:'gray'}}>posts</Text>
                           </View>
                           <View style={{alignItems:'center'}}>
                                <Text>700</Text>
                                <Text style={{fontSize:10, color:'gray'}}>Followers</Text>
                           </View>
                           <View style={{alignItems:'center'}}>
                                <Text>765</Text>
                                <Text style={{fontSize:10, color:'gray'}}>Following</Text>
                           </View> 
                        </View>
                    </View>
                </View>


                <View style={profile.rows}>
                    {this.state.owner 
                        ? <Button style={profile.edit} 
                        title={'Edit Profile'}
                        onPress={() => this.props.navigation.navigate('Settings')}
                        />

                        : <Button style={profile.edit} 
                        title={'Follow'}
                        />
                    }    
                </View>

                <View style={profile.dataText}>
                    <Text style={profile.username}>{username}</Text>
                    <Text>{created_at}</Text>
                    <Text>WASSUP MATE!</Text>
                </View>

                <View style={profile.tabs}>
                    <Ionicons 
                        style={[this.state.index == 0 ? {color:'purple'} : {}]}
                        size={25} 
                        name={'ios-apps'}
                        onPress={() => this.segmentClick(0)}
                        active={this.state.index == 0}
                         />
                    <Ionicons 
                        style={[this.state.index == 1 ? {color:'purple'} : {}]}
                        size={25} 
                        name={'ios-apps'}
                        onPress={() => this.segmentClick(1)}
                        active={this.state.index == 1}
                         />
                </View>

                {this.renderSection()}

            </ScrollView>
        </Error>
        )
    }
}
{/* <Card
    style={profile.card}  
    title={username}
    image = {(picture.url != null) ? {uri:`${myIp}/${picture.url}`} : null}
    >
                       
    <Text style={profile.text}>
        {created_at}
    </Text>

    {this.state.owner 
        ? <Button 
                style={profile.edit}
                onPress={this.editProfile}
                title = 'Edit Profile'/> 
        : console.log('cant edit')}
</Card> */}