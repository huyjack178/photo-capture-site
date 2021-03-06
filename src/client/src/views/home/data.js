export default {
  get data() {
    return {
      rules: {
        required: value => !!value || 'Required.',
        equal: v => v.length == 11 || 'Equals 11 characters',
      },
      uploadSettings: {
        local: {
          enabled: true,
          ip: '',
        },
        ftp: {
          enabled: false,
          host: '',
          username: '',
          password: '',
        },
        cloudinary: {
          enabled: false,
          cloud_name: '',
          api_key: '',
          api_secret: '',
        },
      },
      serverSettings: {
        ftp: {
          enabled: false,
        },
        cloudinary: {
          enabled: false,
        },
      },
      containerId: '',
      containerDate: '',
      imageFiles: [],
      imageElements: [],
      imageCarouselId: 0,
      showImagesCarousel: false,
      showContainerButtons: false,
      showProgressDialog: false,
      showUploadSettingsDialog: false,
      uploadPopupTitle: 'Đang Upload ....',
    };
  },
};
