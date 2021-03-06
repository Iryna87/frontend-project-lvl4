export const getChannels = (state) => state.channels.channels;

export const getChannelNames = (state) => getChannels(state).map(({ name }) => name);

export const getCurrentChannelId = (state) => state.channels.currentChannelId;

export const getMessages = (state) => state.messages.messages;

export const getModals = (state) => state.modals;

export const getCurrentChannel = (state) => state.channels.channels.filter(
  (channel) => channel.id === state.channels.currentChannelId,
);

export const getChannelById = (id) => (state) => state.channels.channels.filter(
  (channel) => channel.id === id,
);

export const getCurrentChannelMessages = (state) => state.messages.messages.filter(
  (msg) => msg.channelId === state.channels.currentChannelId,
);

export const getModalExtraData = (state) => state.modals.extraData;
