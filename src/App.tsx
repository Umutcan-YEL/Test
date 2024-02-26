import {
  CallControls,
  CallingState,
  ParticipantView,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  StreamVideoParticipant,
  useCallStateHooks,
  User,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

const apiKey = "mmhfdzb5evj2"; // the API key can be found in the "Credentials" section
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiR3JlZWRvIiwiaXNzIjoiaHR0cHM6Ly9wcm9udG8uZ2V0c3RyZWFtLmlvIiwic3ViIjoidXNlci9HcmVlZG8iLCJpYXQiOjE3MDg5NjQ3OTMsImV4cCI6MTcwOTU2OTU5OH0.56IVWDhPY-WkMfMZvHa9c1UIjVTqLVN8rHY5aKd0SgQ"; // the token can be found in the "Credentials" section
const userId = "Grand_Moff_Tarkin"; // the user id can be found in the "Credentials" section
const callId = "viDn6xUsDBfV"; // the call id can be found in the "Credentials" section

// set up the user object
const user: User = {
  id: userId,
  name: "Ahmet",
  image: "https://getstream.io/random_svg/?id=oliver&name=Oliver",
};

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call("default", callId);
call.join({ create: true });

export const MyUILayout = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();
  if (callingState !== CallingState.JOINED) {
    return <div>Loading...</div>;
  }

  return (
    <StreamTheme style={{ position: "relative" }}>
      <SpeakerLayout participantsBarPosition="bottom" />
      <CallControls />
    </StreamTheme>
  );
};

export default function App() {
  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <MyUILayout />
      </StreamCall>
    </StreamVideo>
  );
}

export const MyParticipantList = (props: {
  participants: StreamVideoParticipant[];
}) => {
  const { participants } = props;
  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
      {participants.map((participant) => (
        <div style={{ width: "100%", aspectRatio: "3 / 2" }}>
          <ParticipantView
            muteAudio
            participant={participant}
            key={participant.sessionId}
          />
        </div>
      ))}
    </div>
  );
};

export const MyFloatingLocalParticipant = (props: {
  participant?: StreamVideoParticipant;
}) => {
  const { participant } = props;
  return (
    <div
      style={{
        position: "absolute",
        top: "15px",
        left: "15px",
        width: "240px",
        height: "135px",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 10px 3px",
        borderRadius: "12px",
      }}
    >
      {participant && <ParticipantView muteAudio participant={participant} />}
    </div>
  );
};
