import * as Actions from "../../actionCreators";
import * as Selectors from "../../selectors";
import { useActionCreator, useTypedSelector } from "../../hooks";

const AudiusMenuBar = () => {
  const nextIndex = useTypedSelector(Selectors.getTrackCount);
  const addFilesFromUrl = useActionCreator(Actions.addFilesFromUrl);

  return (
    <>
      <div
        id="playlist-add-menu"
        className="playlist-menu audius-menu-button"
        title="Add an Audius URL"
        onClick={() => addFilesFromUrl(nextIndex)}
      />
      <div
        id="playlist-remove-menu"
        className="playlist-menu audius-menu-button disabled"
        title="Remove (disabled in Audius mode)"
      />
      <div
        id="playlist-selection-menu"
        className="playlist-menu audius-menu-button disabled"
        title="Selection (disabled in Audius mode)"
      />
      <div
        id="playlist-misc-menu"
        className="playlist-menu audius-menu-button disabled"
        title="Misc (disabled in Audius mode)"
      />
    </>
  );
};

export const AudiusListButton = () => {
  return (
    <div
      id="playlist-list-menu"
      className="playlist-menu audius-menu-button disabled"
      title="List (disabled in Audius mode)"
    />
  );
};

export default AudiusMenuBar;
