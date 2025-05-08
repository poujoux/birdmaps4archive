import boto3
import os
import uuid
import json   

class S3B:
    awskey = os.getenv("AWS_ACCESS_KEY_ID")
    awsskey = os.getenv("AWS_SECRET_ACCESS_KEY")

    def __init__(self, bucketn, region):

        self._bucketn = f"{bucketn}.{uuid.uuid4()}"
        self.region = region
        self.s3 = boto3.client('s3', region_name=self.region, aws_access_key_id=self.awskey, aws_secret_access_key=self.awsskey)
        

        #self.createbucket()


    @property 
    def bucketn(self):
        return self._bucketn

    @bucketn.setter
    def bucketn(self, name):
        if not isinstance(name, str):
            print("Invalid name")
            return
        
        self._bucketn = name
    
    def createbucket(self):
        try:
            self.s3.create_bucket(
                    Bucket=self._bucketn,
                    CreateBucketConfiguration={'LocationConstraint': self.region})
            print("It has been created, bucket")

            
            print("It has been granted, bucket")


        except Exception as e:
            print(e)

    def getlist(self,type="buckets"):
        list = self.s3.list_buckets()

        if not list.get("Buckets"):
            print("Error")
            return None;

        if type == "buckets":
            print(list)
            return list

        if type == "objects":
            objects = self.s3.list_objects_v2(Bucket=self._bucketn)
            print(objects["Contents"])
            return objects["Contents"]


    def delbucket(self):
        list = self.s3.list_buckets()

        if not list.get("Buckets"):
            print("Error")
            return;

        try:
            print(1)
            objects = self.s3.list_objects_v2(Bucket=self._bucketn)

            print(2)
            if not objects["Contents"]:
                print("There is no item to be deleted")

                n = [i["Key"] for i in objects["Contents"]]
                print("n: ", n)

                for i in n:
                    self.s3.delete_object(Bucket=self._bucketn, Key=i)
        except:
            print("8292929")

        self.s3.delete_bucket(Bucket=self._bucketn)

        print("It has been deleted")


    def additems(self, name):
        self.s3.put_object(Bucket=self._bucketn, Key=f"{name}/")

        mainp = os.path.join("static", "images", name)

        for i in os.listdir(mainp):
            mainp1 = os.path.join(name, i)
            print(mainp1)
            self.s3.put_object_acl(ACL="public-read", Bucket=self._bucketn, Key=mainp1)


    def linkgen(self, name):

        print("It has been granted, bucket")

        return f"https://{self._bucketn}.s3.amazonaws.com/{name}"



    def getloc(self):
        return self.s3.get_bucket_location(Bucket=self._bucketn)['LocationConstraint']




def bucketsearch(buckt):

    if not buckt:
        buckt = S3B(str(uuid.uuid4()), "eu-north-1") 
        bucktlist = buckt.getlist().get("Buckets", None)

        if bucktlist:
            buckt.bucketn = bucktlist[-1]["Name"]
            print("Name of the bucket: ", buckt.bucketn)

        else:
            buckt.createbucket()

    return buckt


def addandlink(buckt, name):

    buckt.additems(name)
    '''

    imglink = buckt.objj(
    n8link = buckt.objj
    '''

    return imglink, n8link



