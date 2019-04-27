import React, { Component } from 'react';
import firebase from 'firebase';
import FileUploader from 'react-firebase-file-uploader';
import CustomUploadButton from 'react-firebase-file-uploader/lib/CustomUploadButton';

const config = {
  apiKey: "shupala",
  authDomain: "shupala.firebaseapp.com",
  // databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
  storageBucket: "shupala.appspot.com",
};
firebase.initializeApp(config);

class ProfilePage extends Component {
  state = {
    username: '',
    avatar: '',
    isUploading: false,
    progress: 0,
    avatarURL: ''
  };

  handleChangeUsername = (event) => this.setState({ username: event.target.value });
  handleUploadStart = () => this.setState({ isUploading: true, progress: 0 });
  handleProgress = (progress) => this.setState({ progress });
  handleUploadError = (error) => {
    this.setState({ isUploading: false });
    console.error(error);
  }
  handleUploadSuccess = (filename) => {
    this.setState({ avatar: filename, progress: 100, isUploading: false });
    firebase.storage().ref('images').child(filename).getDownloadURL().then(url => this.setState({ avatarURL: url }));
  };
  render() {
    return (
      <div>
        <form>
          <label>Username:</label>
          <input type="text" value={this.state.username} name="username" onChange={this.handleChangeUsername} />
          <label>Avatar:</label>
          {this.state.isUploading &&
            <p>Progress: {this.state.progress}</p>
          }
          {this.state.avatarURL &&
            <img src={this.state.avatarURL} />
          }
          <label style={{ backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4, pointer: 'cursor' }}>
            <CustomUploadButton
              accept="image/*"
              storageRef={firebase.storage().ref('images')}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
              style={{ backgroundColor: 'steelblue', color: 'white', padding: 10, borderRadius: 4 }}
            >
              Select your awesome avatar
            </CustomUploadButton>
            <FileUploader
              accept="image/*"
              name="avatar"
              filename={file => this.state.username + file.name.split('.')[1] }
              storageRef={firebase.storage().ref('images')}
              onUploadStart={this.handleUploadStart}
              onUploadError={this.handleUploadError}
              onUploadSuccess={this.handleUploadSuccess}
              onProgress={this.handleProgress}
              />
          </label>
        </form>
      </div>
    );
  }
}
export default ProfilePage;