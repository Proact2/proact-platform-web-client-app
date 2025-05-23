const axios = require('axios');
import {addAttachmentToMessage , addVideoAttachmentToMessage, getVideoUploadRequest} from "./attachmentApiService";
import attachmentType from "../../../../constants/attachmentType";
import axiosInstance from "../axiosInstance";

async function getMessages(projectId, medicalTeamId, pagingCount, onApiOkResultCallback, onApiKoResultCallback,cancelToken) {
    await axiosInstance.get(`Messages/${projectId}/${medicalTeamId}/${pagingCount}`,{ cancelToken })
        .then(response => {
            onApiOkResultCallback(response.data);
        })
        .catch(error => {
            onApiKoResultCallback(error);
        });
}

async function filterMessagesByPatient(projectId, medicalTeamId, patientId, pagingCount, onApiOkResultCallback, onApiKoResultCallback) {
    await axiosInstance.get(`Messages/${projectId}/${medicalTeamId}/${patientId}/${pagingCount}`)
        .then(response => {
            onApiOkResultCallback(response.data);
        })
        .catch(error => {
            if (axiosInstance.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                onApiKoResultCallback(error);
            }
        });
}

async function filterMessages(projectId, medicalTeamId,patientId,searchText, pagingCount,isPatient, onApiOkResultCallback, onApiKoResultCallback,cancelToken) {
    
    var url ="";
    if(isPatient)
        url=`Messages/${projectId}/${medicalTeamId}/patient/search`;
    else
        url = `Messages/${projectId}/${medicalTeamId}/${pagingCount}/medic/search`;

    if(searchText!=null || searchText!="")
        url = url + `?message=${searchText}`;
    if(!isPatient && patientId!=null)
        url = url + `&patient=${patientId}`;

    console.log(url);
    await axiosInstance.get(url,{ cancelToken })
        .then(response => {
            console.log(response.data);
            onApiOkResultCallback(response.data);
        })
        .catch(error => {
            if (axiosInstance.isCancel(error)) {
                console.log('Request canceled', error.message);
            } else {
                onApiKoResultCallback(error);
            }
        });
}

async function createMessage(request, onApiOkResultCallback, onApiKoResultCallback) {
    await axiosInstance.post(`Messages/${request.projectId}/${request.medicalTeamId}/create`, request)
        .then(response => {
            onApiOkResultCallback(response.data);
        })
        .catch(error => {
            onApiKoResultCallback(error);
        });
}

async function createMessageWithImageAttachment(request, attachment, onApiOkResultCallback, onApiKoResultCallback) {
    createMessage(request, (message => {
        addAttachmentToMessage(
            attachment,
            message.messageId,
            attachmentType.IMAGE,
            onApiOkResultCallback,
            onApiKoResultCallback);

    }), onApiKoResultCallback);
}

async function createMessageWithVoiceAttachment(request, attachment, onApiOkResultCallback, onApiKoResultCallback) {
    createMessage(request, (message => {
        addAttachmentToMessage(
            attachment,
            message.messageId,
            attachmentType.VOICE,
            onApiOkResultCallback,
            onApiKoResultCallback);

    }), onApiKoResultCallback);
}

/* async function createMessageWithVideoAttachment(request, attachment,width,height, onApiOkResultCallback, onApiKoResultCallback) {
    createMessage(request, (message => {
        addVideoAttachmentToMessage(
            attachment,
            message.messageId,
            attachmentType.VIDEO,
            width,
            height,
            onApiOkResultCallback,
            onApiKoResultCallback);

    }), onApiKoResultCallback);
} */

async function createMessageWithVideoAttachment(request, attachment, width, height, duration, thumbnails, onApiOkResultCallback, onApiKoResultCallback) {
    createMessage(request, (message => {
        getVideoUploadRequest(
            message.messageId,
            attachment,
            width, 
            height,
            duration,
            thumbnails,
            onApiOkResultCallback,
            onApiKoResultCallback);
    
    }), onApiKoResultCallback);
}

async function createBroadcast(request, onApiOkResultCallback, onApiKoResultCallback) {
    await axiosInstance.post(`Messages/${request.projectId}/${request.medicalTeamId}/createbroadcast`, request)
        .then(response => {
            onApiOkResultCallback(response.data);
        })
        .catch(error => {
            onApiKoResultCallback(error);
        });
}

async function editBroadcast(request, onApiOkResultCallback, onApiKoResultCallback) {
    await axiosInstance.post(`Messages/${request.projectId}/${request.medicalTeamId}/${request.messageId}/editbroadcast`, request)
        .then(response => {
            onApiOkResultCallback(response.data);
        })
        .catch(error => {
            onApiKoResultCallback(error);
        });
}

async function createReply(request, onApiOkResultCallback, onApiKoResultCallback) {
    await axiosInstance.post(`Messages/${request.projectId}/${request.medicalTeamId}/replyTo/${request.originalMessageId}`, request)
        .then(response => {
            onApiOkResultCallback(response.data);
        })
        .catch(error => {
            onApiKoResultCallback(error);
        });
}

async function createReplyWithImageAttachment(request, attachment, onApiOkResultCallback, onApiKoResultCallback) {
    createReply(request, (message => {
        addAttachmentToMessage(
            attachment,
            message.messageId,
            attachmentType.IMAGE,
            onApiOkResultCallback,
            onApiKoResultCallback);

    }), onApiKoResultCallback);
}

async function createReplyWithVoiceAttachment(request, attachment, onApiOkResultCallback, onApiKoResultCallback) {
    createReply(request, (message => {
        addAttachmentToMessage(
            attachment,
            message.messageId,
            attachmentType.VOICE,
            onApiOkResultCallback,
            onApiKoResultCallback);

    }), onApiKoResultCallback);
}

/* async function createReplyWithVideoAttachment(request, attachment,width,height, duration, onApiOkResultCallback, onApiKoResultCallback) {
    createReply(request, (message => {
        addVideoAttachmentToMessage(
            attachment,
            message.messageId,
            attachmentType.VIDEO,
            width,
            height,
            duration,
            onApiOkResultCallback,
            onApiKoResultCallback);

    }), onApiKoResultCallback);
} */

async function createReplyWithVideoAttachment(request, attachment,width,height, duration, thumbnails, onApiOkResultCallback, onApiKoResultCallback) {
    createReply(request, (message => {
        getVideoUploadRequest(
            message.messageId,
            attachment,
            width, 
            height,
            duration,
            thumbnails,
            onApiOkResultCallback,
            onApiKoResultCallback);
    
    }), onApiKoResultCallback);
}

async function createMessagebyMedic(request, onApiOkResultCallback, onApiKoResultCallback) {
    await axiosInstance.post(`Messages/${request.projectId}/${request.medicalTeamId}/${request.patientId}/createbyMedic`, request)
        .then(response => {
            onApiOkResultCallback(response.data);
        })
        .catch(error => {
            onApiKoResultCallback(error);
        });
}

async function deleteMessage(request, onApiOkResultCallback, onApiKoResultCallback) {
    await axiosInstance.delete(`Messages/${request.projectId}/${request.medicalTeamId}/${request.messageId}`)
        .then(response => {
            onApiOkResultCallback(response.data);
        })
        .catch(error => {
            onApiKoResultCallback(error);
        });
}




/*  if(
  (("standalone" in window.navigator) && !window.navigator.standalone)
  ||
  (!window.matchMedia('(display-mode: standalone)').matches)
) {
 console.log(window.matchMedia('(display-mode: standalone)').matches)
addToHomescreen({
detectHomescreen: true
}); 
} */




export {
    getMessages,
    createBroadcast,
    createMessage,
    createMessageWithImageAttachment,
    createMessageWithVoiceAttachment,
    createMessageWithVideoAttachment,
    createReply,
    createReplyWithImageAttachment,
    createReplyWithVoiceAttachment,
    createReplyWithVideoAttachment,
    deleteMessage,
    createMessagebyMedic,
    editBroadcast,
    filterMessagesByPatient,
    filterMessages
};