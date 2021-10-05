export const getChannels = (state) => state.channels.channels;

export const getCurrentChannelId = (state) => state.channels.currentChannelId;

export const getMessages = (state) => state.messages.messages;

export const getModals = (state) => state.modals;

export const getCurrentChannel = (state) => state.channels.channels.filter(
  (channel) => channel.id === state.channels.currentChannelId,
);

export const getCurrentChannelMessages = (state) => state.messages.messages.filter(
  (msg) => msg.channelId === state.channels.currentChannelId,
);
