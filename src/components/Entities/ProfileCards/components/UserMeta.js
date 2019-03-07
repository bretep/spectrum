// @flow
import React from 'react';
import renderTextWithLinks from 'src/helpers/render-text-with-markdown-links';
import addProtocolToString from 'shared/normalize-url';
import Icon from 'src/components/icons';
import GithubProfile from 'src/components/githubProfile';
import {
  MetaContainer,
  Name,
  Description,
  MetaLinksContainer,
  MetaRow,
  OnlineDot,
  Username,
} from '../style';

export const UserMeta = (props: UserMetaType) => {
  const { user } = props;
  const { description, website, githubUsername, isOnline } = user;
  const formattedDescription = description && renderTextWithLinks(description);
  const formattedWebsite = website && addProtocolToString(website);

  return (
    <MetaContainer>
      <Name>{user.name}</Name>
      {user.username && <Username>@{user.username}</Username>}

      {formattedDescription && (
        <Description>{formattedDescription}</Description>
      )}

      <MetaLinksContainer>
        {formattedWebsite && (
          <MetaRow>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={formattedWebsite}
            >
              <Icon glyph={'link'} size={20} /> {website}
            </a>
          </MetaRow>
        )}

        <GithubProfile
          id={user.id}
          render={profile => {
            if (!profile) {
              return null;
            } else {
              return (
                <MetaRow>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`https://github.com/${profile.username}`}
                  >
                    <Icon glyph={'github'} size={20} /> @{profile.username}
                  </a>
                </MetaRow>
              );
            }
          }}
        />

        {isOnline && (
          <MetaRow>
            <OnlineDot /> Online now
          </MetaRow>
        )}
      </MetaLinksContainer>
    </MetaContainer>
  );
};