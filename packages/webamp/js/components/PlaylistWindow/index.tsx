import classnames from "classnames";

import { WINDOWS } from "../../constants";
import * as Actions from "../../actionCreators";
import * as Selectors from "../../selectors";

import DropTarget from "../DropTarget";
import Vis from "../Vis";
import PlaylistShade from "./PlaylistShade";
import PlaylistResizeTarget from "./PlaylistResizeTarget";
import PlaylistActionArea from "./PlaylistActionArea";
import AudiusPlaylist from "./AudiusPlaylist";
import AudiusMenuBar, { AudiusListButton } from "./AudiusMenuBar";

import FocusTarget from "../FocusTarget";
import { useActionCreator, useTypedSelector } from "../../hooks";
import WinampButton from "../WinampButton";

interface Props {
  analyser: AnalyserNode;
}

function PlaylistWindow({ analyser }: Props) {
  const getWindowSize = useTypedSelector(Selectors.getWindowSize);
  const selectedWindow = useTypedSelector(Selectors.getFocusedWindow);
  const getWindowShade = useTypedSelector(Selectors.getWindowShade);
  const getWindowOpen = useTypedSelector(Selectors.getWindowOpen);
  const skinPlaylistStyle = useTypedSelector(Selectors.getSkinPlaylistStyle);
  const getWindowPixelSize = useTypedSelector(Selectors.getWindowPixelSize);

  const selected = selectedWindow === WINDOWS.PLAYLIST;
  const playlistShade = Boolean(getWindowShade(WINDOWS.PLAYLIST));
  const playlistSize = getWindowSize(WINDOWS.PLAYLIST);
  const playlistWindowPixelSize = getWindowPixelSize(WINDOWS.PLAYLIST);

  const close = useActionCreator(Actions.closeWindow);
  const toggleShade = useActionCreator(Actions.togglePlaylistShadeMode);
  const handleDrop = () => {};

  const showVisualizer = playlistSize[0] > 2;
  const activateVisualizer = !getWindowOpen(WINDOWS.MAIN);

  if (playlistShade) {
    return <PlaylistShade />;
  }

  const style = {
    color: skinPlaylistStyle.normal,
    backgroundColor: skinPlaylistStyle.normalbg,
    fontFamily: `${skinPlaylistStyle.font}, Arial, sans-serif`,
    height: `${playlistWindowPixelSize.height}px`,
    width: `${playlistWindowPixelSize.width}px`,
  };

  const classes = classnames("window", "draggable", { selected });

  const showSpacers = playlistSize[0] % 2 === 0;

  return (
    <FocusTarget windowId={WINDOWS.PLAYLIST}>
      <DropTarget
        id="playlist-window"
        windowId={WINDOWS.PLAYLIST}
        className={classes}
        style={style}
        handleDrop={handleDrop}
      >
        <div className="playlist-top draggable" onDoubleClick={toggleShade}>
          <div className="playlist-top-left draggable" />
          {showSpacers && (
            <div className="playlist-top-left-spacer draggable" />
          )}
          <div className="playlist-top-left-fill draggable" />
          <div className="playlist-top-title draggable" />
          {showSpacers && (
            <div className="playlist-top-right-spacer draggable" />
          )}
          <div className="playlist-top-right-fill draggable" />
          <div className="playlist-top-right draggable">
            <WinampButton id="playlist-shade-button" onClick={toggleShade} />
            <WinampButton
              id="playlist-close-button"
              onClick={() => close(WINDOWS.PLAYLIST)}
            />
          </div>
        </div>
        <div className="playlist-middle draggable">
          <div className="playlist-middle-left draggable" />
          <div className="playlist-middle-center">
            <AudiusPlaylist />
          </div>
          <div className="playlist-middle-right draggable" />
        </div>
        <div className="playlist-bottom draggable">
          <div className="playlist-bottom-left draggable">
            <AudiusMenuBar />
          </div>
          <div className="playlist-bottom-center draggable" />
          <div className="playlist-bottom-right draggable">
            {showVisualizer && (
              <div className="playlist-visualizer">
                {activateVisualizer && (
                  <div className="visualizer-wrapper">
                    <Vis analyser={analyser} />
                  </div>
                )}
              </div>
            )}
            <PlaylistActionArea />
            <AudiusListButton />
            <PlaylistResizeTarget />
          </div>
        </div>
      </DropTarget>
    </FocusTarget>
  );
}

export default PlaylistWindow;
