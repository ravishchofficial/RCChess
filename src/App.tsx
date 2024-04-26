import styled from "styled-components";
import Game from "./components/Game";
import Logo from "./assets/logo";

function App() {
	return (
		<>
			<StyledLogo />
			<Game />
		</>
	);
}

const StyledLogo = styled(Logo)`
	position: absolute;
	top: 20px;
	left: 20px;
	width: 300px;
	height: auto;
`;

export default App;
