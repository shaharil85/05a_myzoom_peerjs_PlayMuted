import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
declare var Peer: any;
var peer = new Peer();

var myID;
var clientHasCall = [];
var myVideoStream = null;
var howmany = null;

var clientVideoStream = [];
var clientCamera = null;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mypeerid: any;
  anotherid: any;
  roomId: any;
  
  constructor(private socket: Socket, private toastCtrl: ToastController) { }
  ngOnInit() {

    setTimeout(() => {
      this.openCamera()
      this.socket.connect();
      myID = peer.id;
      clientHasCall.push(peer.id);
      this.mypeerid = peer.id;
      //this.openCamera();
      this.socket.emit('set-name', this.mypeerid);
      this.socket.fromEvent('users-changed').subscribe(data => {
        let user = data['user'];
        if (data['event'] === 'left') {
          this.showToast('User left: ' + user);
          //document.getElementsByTagName("video")[howmany - 1].setAttribute("id", fname);
          console.log(document.getElementById(user).remove() ) 

        } else {
          this.showToast('User joined: ' + user);
        }
      });
      this.socket.emit('set-camera', this.mypeerid, true);
      this.socket.emit('list-client');
    },1000);

    this.socket.emit('request-camera');
    this.socket.fromEvent('request-camera').subscribe(data => {
      clientCamera = data['user'];
    });
    this.socket.fromEvent('list-client').subscribe(data => {
      //console.log(myID);
      //console.log(clientHasCall);
      let client_available = data['user'];
      // console.log(client_available);
      // console.log(clientHasCall);
      for (var i = 0; i < clientHasCall.length; i++) {

        for (var k = 0; k < client_available.length; k++) {
          if (client_available[k] == clientHasCall[i]) {
            client_available.splice(k, 1);
            i--;
          }
        }
      }
      if (client_available.length == 0) { }
      else {
        for (var i = 0; i < client_available.length; i++) {
          clientHasCall.push(client_available[i])
        }
        for (var i = 0; i < client_available.length; i++) {
          this.anotherid = client_available[i];
          this.mediaCall();
          this.mediaAnswer();
        }
      }
    });
  }
  openCamera() {
    var n = <any>navigator;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;
    n.getUserMedia({
      video: { width: 320, height: 320 },
      audio: true
    },
      function (stream) {
        var video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        document.getElementById("myList").appendChild(video);
        document.getElementsByTagName("video")[0].setAttribute("id", myID);
        myVideoStream = stream;
        //myVideoStream.getVideoTracks()[0].enabled = !(myVideoStream.getVideoTracks()[0].enabled);
      });
  }
  // ## Media calls ##
  mediaAnswer() {
    var video = document.createElement('video');
    var n = <any>navigator;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;
    peer.on('call', function (call) {
      n.getUserMedia({ video: { width: 320, height: 320 }, audio: false }, function (stream) {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on('stream', function (remoteStream) {
          clientVideoStream.push(stream);
          stream.getVideoTracks()[0].enabled = !clientCamera;
          if (stream.getVideoTracks()[0].enabled == true) {
           
          }
          else {
            stream.getVideoTracks()[0].enabled = clientCamera;
            if (myVideoStream.getVideoTracks()[0].enabled) {
              stream.getVideoTracks()[0].enabled = clientCamera;
            }
            else{
              stream.getVideoTracks()[0].enabled = !clientCamera;
            }
          }
          // Show stream in some video/canvas element.
          //video.srcObject = remoteStream;
          //video.play();
          //document.getElementById("myList").appendChild(video);
        });
      }, function (err) {
        console.log('Failed to get local stream', err);
      });
    });
  }
  mediaCall() {
    var video = document.createElement('video');
    var locaVar = peer;
    var fname = this.anotherid;

    var n = <any>navigator;
    n.getUserMedia = n.getUserMedia || n.webkitGetUserMedia || n.mozGetUserMedia;
    n.getUserMedia({ video: { width: 320, height: 320 }, audio: false }, function (stream) {
      var call = locaVar.call(fname, stream);
      call.on('stream', function (remoteStream) {
        // Show stream in some video/canvas element.
        video.srcObject = remoteStream;
        video.play();
        document.getElementById("myList").appendChild(video);
        howmany = document.getElementById("myList").childElementCount;
        //console.log(howmany);
        document.getElementsByTagName("video")[howmany - 1].setAttribute("id", fname);
        //clientID = this.fname;
      });
      call.on('close', () => {
        video.remove()
      })
    }, function (err) {
      console.log('Failed to get local stream', err);
    });
  }
  muteUnmute() {
    let enabled = myVideoStream.getAudioTracks()[0].enabled;
    myVideoStream.getAudioTracks()[0].enabled = !(myVideoStream.getAudioTracks()[0].enabled);
    if (enabled) {
      document.querySelector('.main__mute_button').innerHTML = '<span>Unmute</span>';
    }
    else {
      document.querySelector('.main__mute_button').innerHTML = '<span>Mute</span>';
    }
  }
  playStop() {
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    myVideoStream.getVideoTracks()[0].enabled = !(myVideoStream.getVideoTracks()[0].enabled);
    this.socket.emit('set-camera', this.mypeerid, myVideoStream.getVideoTracks()[0].enabled);

    for (var i = 0; i < clientVideoStream.length; i++) {
      clientVideoStream[i].getVideoTracks()[0].enabled = !(clientVideoStream[i].getVideoTracks()[0].enabled);
      let clientenabled = clientVideoStream[i].getVideoTracks()[0].enabled;
      // if (clientenabled) {
      //   clientVideoStream[i].getVideoTracks()[0].enabled = false;

      // } else {
      //   clientVideoStream[i].getVideoTracks()[0].enabled = true;
      // }
      //clientVideoStream[i].getVideoTracks()[0].enabled = !(clientVideoStream[i].getVideoTracks()[0].enabled);
    }
    if (enabled) {
      document.querySelector('.main__video_button').innerHTML = '<span>Play Video</span>';
    }
    else {
      document.querySelector('.main__video_button').innerHTML = '<span>Stop Video</span>';
    }
  }
  async showToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
}
