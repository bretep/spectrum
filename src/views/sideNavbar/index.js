// @flow
import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { getCurrentUserCommunityConnection } from 'shared/graphql/queries/user/getUserCommunityConnection';
import { Container, AvatarGrid, AvatarLink, Avatar, Shortcut } from './style';

const SideNavbar = (props: Props) => {
  const { data, match, history } = props;
  const { user } = data;

  if (!user) return null;

  const { communityConnection } = user;
  const { edges } = communityConnection;
  const communities = edges.map(edge => edge && edge.node);
  const sorted = communities.slice().sort((a, b) => {
    const bc = parseInt(b.communityPermissions.reputation, 10);
    const ac = parseInt(a.communityPermissions.reputation, 10);

    // sort same-reputation communities alphabetically
    if (ac === bc) {
      return a.name.toUpperCase() <= b.name.toUpperCase() ? -1 : 1;
    }

    // otherwise sort by reputation
    return bc <= ac ? -1 : 1;
  });

  useEffect(() => {
    const handleCommunitySwitch = e => {
      const ONE = 49;
      const TWO = 50;
      const THREE = 51;
      const FOUR = 52;
      const FIVE = 53;
      const SIX = 54;
      const SEVEN = 55;
      const EIGHT = 56;
      const NINE = 57;

      const possibleKeys = [
        ONE,
        TWO,
        THREE,
        FOUR,
        FIVE,
        SIX,
        SEVEN,
        EIGHT,
        NINE,
      ];

      if (e.altKey) {
        const index = possibleKeys.indexOf(e.keyCode);
        if (index >= 0) {
          const community = sorted[index];
          if (!community) return;
          return history.push(`/${community.slug}`);
        }
      }
    };

    window.addEventListener('keydown', handleCommunitySwitch, false);
    return () =>
      window.removeEventListener('keydown', handleCommunitySwitch, false);
  }, []);

  return (
    <Container>
      {sorted.map((community, index) => {
        if (!community) return null;

        const { communityPermissions } = community;
        const { isMember, isBlocked } = communityPermissions;
        if (!isMember || isBlocked) return null;

        const isActive = community.slug === match.params.communitySlug;
        return (
          <AvatarGrid>
            <AvatarLink
              tipText={community.name}
              tipLocation={'right'}
              to={`/${community.slug}`}
              key={community.id}
            >
              <Avatar
                isActive={isActive}
                src={community.profilePhoto}
                size={36}
              />
            </AvatarLink>
            {index < 10 && <Shortcut>⌥{index + 1}</Shortcut>}
          </AvatarGrid>
        );
      })}
    </Container>
  );
};

export default compose(
  // $FlowIssue
  connect(),
  getCurrentUserCommunityConnection,
  viewNetworkHandler
)(SideNavbar);