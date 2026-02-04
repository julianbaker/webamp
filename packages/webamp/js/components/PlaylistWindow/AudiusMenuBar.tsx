import { useCallback } from "react";
import * as Actions from "../../actionCreators";
import * as Selectors from "../../selectors";
import { useActionCreator, useTypedSelector } from "../../hooks";

/* eslint-disable no-alert */

const DISABLED_MESSAGE = "Disabled in Audius mode.";

const AudiusMenuBar = () => {
  const nextIndex = useTypedSelector(Selectors.getTrackCount);
  const addFilesFromUrl = useActionCreator(Actions.addFilesFromUrl);

  const handleDisabled = useCallback(() => {
    alert(DISABLED_MESSAGE);
  }, []);

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
        onClick={handleDisabled}
      />
      <div
        id="playlist-selection-menu"
        className="playlist-menu audius-menu-button disabled"
        title="Selection (disabled in Audius mode)"
        onClick={handleDisabled}
      />
      <div
        id="playlist-misc-menu"
        className="playlist-menu audius-menu-button disabled"
        title="Misc (disabled in Audius mode)"
        onClick={handleDisabled}
      />
    </>
  );
};

export const AudiusListButton = () => {
  const handleDisabled = useCallback(() => {
    alert(DISABLED_MESSAGE);
  }, []);

  return (
    <div
      id="playlist-list-menu"
      className="playlist-menu audius-menu-button disabled"
      title="List (disabled in Audius mode)"
      onClick={handleDisabled}
    />
  );
};

export default AudiusMenuBar;
