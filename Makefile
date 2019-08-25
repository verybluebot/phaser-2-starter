.PHONY: run

# certs and output
OUTPUT_FILE=mytestbuild.apk
ALIAS=key0
KEYSTORE=androidCerts/starter-game

UNSIGNED=platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk
# or, if you're using Crosswalk:
# UNSIGNED=platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk

PACKAGE='io.shugostudios.starter'

# create a signed apk
sign:
	rm -f ${OUTPUT_FILE}
	cordova build android --release
	jarsigner -verbose -sigalg MD5withRSA -digestalg SHA1 -keystore ${KEYSTORE} ${UNSIGNED} ${ALIAS}
	~/Library/Android/sdk/build-tools/28.0.3/zipalign -v 4 ${UNSIGNED} ${OUTPUT_FILE}

execute:
	adb shell am start -n ${PACKAGE}/${PACKAGE}.MainActivity

# install a signed apk on a device
install:
	adb install -r ${OUTPUT_FILE}

# monitor logs and filter by package name
log:
	adb logcat chromium:I *:S

run: sign install execute log
